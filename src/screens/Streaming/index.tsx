import { useRoute } from '@react-navigation/native';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Video from 'react-native-video';
import { COLORS } from '../../constants';

interface StreamParams {
  videoStream: any;
}

const Streaming: React.FC = () => {
  const playerRef = useRef(null);
  const route = useRoute();

  const [video, setVideo] = useState<any>();

  useEffect(() => {
    const { videoStream } = route.params as StreamParams;

    setVideo(videoStream);
  }, [route.params]);

  return (
    <View style={styles.container}>
      {!video && <ActivityIndicator size="large" color={COLORS.primary} />}
      {video && (
        <Video
          source={video}
          ref={playerRef}
          style={styles.video}
          resizeMode="contain"
          repeat={false}
          controls
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Streaming;
