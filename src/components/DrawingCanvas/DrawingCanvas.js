import {
  Canvas,
  ImageFormat,
  Path,
  useCanvasRef,
} from '@shopify/react-native-skia';
import { RotateCcw, Undo2, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '../../theme/useTheme';
import getStyles from './DrawingCanvas.styles';

const COLORS = ['#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B'];

const DrawingCanvas = ({ visible, onClose, onInsertImage }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState([]);
  const [activeColor, setActiveColor] = useState(COLORS[0]);

  const [currentPath, setCurrentPath] = useState(null);

  const handleTouchStart = e => {
    const { locationX, locationY } = e.nativeEvent;
    setCurrentPath(`M ${locationX} ${locationY}`);
  };

  const handleTouchMove = e => {
    if (currentPath) {
      const { locationX, locationY } = e.nativeEvent;
      setCurrentPath(prev => prev + ` L ${locationX} ${locationY}`);
    }
  };

  const handleTouchEnd = () => {
    if (currentPath) {
      setPaths(prev => [...prev, { path: currentPath, color: activeColor }]);
      setCurrentPath(null);
    }
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath(null);
  };

  const handleUndo = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  const getBase64Image = () => {
    const image = canvasRef.current?.makeImageSnapshot();
    if (image) {
      const base64 = image.encodeToBase64(ImageFormat.PNG, 100);
      return `data:image/png;base64,${base64}`;
    }
    return null;
  };

  const handleInsert = () => {
    const base64 = getBase64Image();
    if (base64) {
      onInsertImage(base64);
      onClose();
    }
  };

  const handleSaveToDevice = async () => {
    const base64 = getBase64Image();
    if (base64) {
      try {
        const rawBase64 = base64.replace('data:image/png;base64,', '');
        const path = `${RNFS.DocumentDirectoryPath}/drawing_${Date.now()}.png`;
        await RNFS.writeFile(path, rawBase64, 'base64');
        Alert.alert('Saved', 'Drawing saved to pictures.');
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to save drawing.');
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Draw on Canvas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color={colors.textSecondary} size={RFValue(20)} />
            </TouchableOpacity>
          </View>

          <View
            style={styles.canvasContainer}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Canvas style={styles.canvas} ref={canvasRef}>
              {paths.map((p, index) => (
                <Path
                  key={index}
                  path={p.path}
                  color={p.color}
                  style="stroke"
                  strokeWidth={4}
                  strokeCap="round"
                  strokeJoin="round"
                />
              ))}
              {currentPath && (
                <Path
                  path={currentPath}
                  color={activeColor}
                  style="stroke"
                  strokeWidth={4}
                  strokeCap="round"
                  strokeJoin="round"
                />
              )}
            </Canvas>
          </View>

          <View style={styles.toolbar}>
            {COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorBtn,
                  activeColor === c && styles.colorBtnActive,
                  { backgroundColor: c },
                ]}
                onPress={() => setActiveColor(c)}
              />
            ))}
            <TouchableOpacity style={styles.actionBtn} onPress={handleUndo}>
              <Undo2 color={colors.primary} size={RFValue(16)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleClear}>
              <RotateCcw color={colors.primary} size={RFValue(16)} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.saveAsImageBtn}
              onPress={handleSaveToDevice}
            >
              <Text style={styles.saveAsImageBtnText}>Save as Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.insertBtn} onPress={handleInsert}>
              <Text style={styles.insertBtnText}>Insert into Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DrawingCanvas;
