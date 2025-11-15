import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/Supabase';

export default function GroupChatScreen({ route, navigation }) {
  const { 
    groupId, 
    groupName, 
    groupIcon,
    friendId,
    friendName,
    friendAvatar,
    isDirectChat = false
  } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    loadUserData();
  }, [groupId, friendId]);

  useEffect(() => {
    if (currentUserId) {
      loadMessages();
    }
  }, [currentUserId]);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        if (profile) {
          setCurrentUserName(profile.username || 'You');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadMessages = async () => {
    try {
      // Mock messages - replace with actual data fetching
      const otherUserAvatar = isDirectChat 
        ? (friendAvatar || 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg')
        : 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg';
      const otherUserName = isDirectChat 
        ? (friendName || 'Friend')
        : 'Mengmeng';

      const mockMessages = isDirectChat ? [
        // Direct chat messages - simpler conversation
        {
          id: 1,
          senderId: friendId,
          senderName: otherUserName,
          senderAvatar: otherUserAvatar,
          text: 'Hello!',
          timestamp: '10:30',
          type: 'text',
        },
        {
          id: 2,
          senderId: currentUserId,
          senderName: currentUserName || 'You',
          senderAvatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg',
          text: 'Hi! How are you?',
          timestamp: '10:32',
          type: 'text',
        },
        {
          id: 3,
          senderId: friendId,
          senderName: otherUserName,
          senderAvatar: otherUserAvatar,
          text: 'I tried a new recipe today',
          timestamp: '10:35',
          type: 'text',
        },
        {
          id: 4,
          senderId: friendId,
          senderName: otherUserName,
          senderAvatar: otherUserAvatar,
          text: 'Check it out!',
          timestamp: '10:35',
          type: 'text',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
        },
        {
          id: 5,
          senderId: currentUserId,
          senderName: currentUserName || 'You',
          senderAvatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg',
          text: 'Looks delicious!',
          timestamp: '10:40',
          type: 'text',
        },
      ] : [
        // Group chat messages
        {
          id: 1,
          senderId: 'other1',
          senderName: 'Mengmeng',
          senderAvatar: otherUserAvatar,
          text: 'I tried a new recipe',
          timestamp: '10:35',
          type: 'text',
        },
        {
          id: 2,
          senderId: 'other1',
          senderName: 'Mengmeng',
          senderAvatar: otherUserAvatar,
          text: 'Check it out!',
          timestamp: '10:35',
          type: 'text',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
        },
        {
          id: 3,
          senderId: 'other1',
          senderName: 'Mengmeng',
          senderAvatar: otherUserAvatar,
          text: 'I love it!',
          timestamp: '10:38',
          type: 'text',
        },
        {
          id: 4,
          senderId: 'other1',
          senderName: 'Mengmeng',
          senderAvatar: otherUserAvatar,
          text: 'If you add more salt it tastes a lot better',
          timestamp: '10:45',
          type: 'text',
        },
        {
          id: 5,
          senderId: 'other1',
          senderName: 'Mengmeng',
          senderAvatar: otherUserAvatar,
          text: 'I also uploaded this one.',
          timestamp: '10:45',
          type: 'text',
          image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&h=200&fit=crop',
        },
        {
          id: 6,
          senderId: 'other1',
          senderName: 'Mengmeng',
          senderAvatar: otherUserAvatar,
          text: 'I love that to!',
          timestamp: '10:45',
          type: 'text',
        },
        {
          id: 7,
          senderId: currentUserId,
          senderName: currentUserName || 'You',
          senderAvatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg',
          text: 'No, I actually like the taste of it, like it is descripted.',
          timestamp: '10:55',
          type: 'text',
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUserId,
      senderName: currentUserName || 'You',
      senderAvatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).slice(0, 5),
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    setShowAttachmentMenu(false);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleAttachmentPress = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const handleAttachmentOption = (option) => {
    // Handle attachment options (Recipe, Image, Camera)
    console.log('Selected attachment option:', option);
    setShowAttachmentMenu(false);
    // Implement actual attachment logic here
  };

  const renderMessage = (message) => {
    const isCurrentUser = message.senderId === currentUserId;
    
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageContainerRight : styles.messageContainerLeft,
        ]}
      >
        {!isCurrentUser && (
          <Image source={{ uri: message.senderAvatar }} style={styles.messageAvatar} />
        )}
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.messageBubbleRight : styles.messageBubbleLeft,
          ]}
        >
          {message.image && (
            <Image source={{ uri: message.image }} style={styles.messageImage} />
          )}
          <Text style={styles.messageText}>{message.text}</Text>
          <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
        </View>
        {isCurrentUser && (
          <Image source={{ uri: message.senderAvatar }} style={styles.messageAvatar} />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isDirectChat ? 'Chat' : 'Group chat'}
          </Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.roomInfo}>
          <Image
            source={{ 
              uri: isDirectChat 
                ? (friendAvatar || 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg')
                : 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop'
            }}
            style={styles.roomAvatar}
          />
          <Text style={styles.roomName}>
            {isDirectChat ? (friendName || 'Friend') : (groupName || 'Room 3A')}
          </Text>
        </View>
      </View>

      {/* Messages Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesArea}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <View style={styles.attachmentMenu}>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleAttachmentOption('recipe')}
          >
            <Ionicons name="restaurant" size={32} color="#CC684F" />
            <Text style={styles.attachmentOptionText}>Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleAttachmentOption('image')}
          >
            <Ionicons name="image" size={32} color="#CC684F" />
            <Text style={styles.attachmentOptionText}>Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleAttachmentOption('camera')}
          >
            <Ionicons name="camera" size={32} color="#CC684F" />
            <Text style={styles.attachmentOptionText}>Camera</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.inputIcon}>
          <Ionicons name="happy" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.inputField}
          placeholder="write something ..."
          placeholderTextColor="#999"
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        {!showAttachmentMenu && (
          <TouchableOpacity onPress={handleAttachmentPress} style={styles.inputIcon}>
            <Ionicons name="paperclip" size={24} color="#666" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="paper-plane" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 60,
  },
  header: {
    backgroundColor: '#CC684F',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    width: 32,
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#E5E5E5',
  },
  roomAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  messagesArea: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageContainerLeft: {
    justifyContent: 'flex-start',
  },
  messageContainerRight: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  messageBubbleLeft: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageBubbleRight: {
    backgroundColor: '#fff',
    borderBottomRightRadius: 4,
  },
  messageImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  messageTimestamp: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'flex-end',
  },
  attachmentMenu: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    justifyContent: 'space-around',
  },
  attachmentOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    minWidth: 80,
  },
  attachmentOptionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputIcon: {
    padding: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingHorizontal: 12,
  },
  sendButton: {
    backgroundColor: '#CC684F',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
});

