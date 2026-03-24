import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '@/hooks/use-colors';

const MOCK_STORIES = [
  { id: 1, name: 'قصتك', image: 'https://i.pravatar.cc/150?u=me', isMe: true },
  { id: 2, name: 'متجر الأحذية', image: 'https://i.pravatar.cc/150?u=1' },
  { id: 3, name: 'إلكترونيات', image: 'https://i.pravatar.cc/150?u=2' },
  { id: 4, name: 'عطور فاخرة', image: 'https://i.pravatar.cc/150?u=3' },
  { id: 5, name: 'موضة ريف', image: 'https://i.pravatar.cc/150?u=4' },
  { id: 6, name: 'ساعات عالمية', image: 'https://i.pravatar.cc/150?u=5' },
];

export function StoriesSection() {
  const colors = useColors();

  return (
    <View style={[styles.container, { borderBottomColor: 'rgba(0,0,0,0.05)', borderBottomWidth: 1 }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MOCK_STORIES.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyContainer}>
            <View style={[
              styles.imageWrapper, 
              { borderColor: story.isMe ? 'transparent' : colors.primary }
            ]}>
              <View style={[styles.imageInnerWrapper, { backgroundColor: colors.background }]}>
                <Image source={{ uri: story.image }} style={styles.image} />
              </View>
              {story.isMe && (
                <View style={[styles.addIcon, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                  <Text style={styles.addIconText}>+</Text>
                </View>
              )}
            </View>
            <Text 
              numberOfLines={1} 
              style={[styles.name, { color: colors.foreground }]}
            >
              {story.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 10,
    gap: 15,
  },
  storyContainer: {
    alignItems: 'center',
    width: 75,
  },
  imageWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  imageInnerWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  name: {
    fontSize: 11,
    textAlign: 'center',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -1,
  },
});
