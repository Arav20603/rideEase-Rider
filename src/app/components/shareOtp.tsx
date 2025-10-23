import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { Toast } from 'toastify-react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { socket } from '@/utils/socket';

const ShareOtp = () => {
  const ride = useSelector((state: RootState) => state.ride)
  const inputRef = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));

  const handleInput = (text: string, index: number) => {
    const updated = [...otp];
    updated[index] = text;
    setOtp(updated);

    if (text && index < inputRef.current.length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = async () => {
    const paste = await Clipboard.getStringAsync();
    if (!paste) return;

    const pasteArray = paste.trim().split('').slice(0, otp.length);
    const updated = [...otp];

    pasteArray.forEach((char, i) => {
      updated[i] = char;
    });

    setOtp(updated);

    const nextIndex = pasteArray.length < otp.length ? pasteArray.length : otp.length - 1;
    setTimeout(() => inputRef.current[nextIndex]?.focus(), 50);

  };

  const handleSubmit = async () => {
    try {
      if (otp.join('') === ride.otp?.toString()) {
        socket.emit('ride_start', {
          msg: 'ride started'
        })
        router.push('/screens/rideStarted')
      } else {
        Toast.show({ text1: 'Enter valid OTP', type: 'error' });
      }
    } catch (error) {
      console.error('error in otp validation');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <TouchableOpacity onLongPress={handlePaste}>
        <View style={styles.grid}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(el) => { if (el) inputRef.current[index] = el }}
              value={value}
              onChangeText={(text) => handleInput(text, index)}
              style={styles.inputBox}
              maxLength={1}
              keyboardType="number-pad"
              textAlign="center"
              placeholder=""
              placeholderTextColor="#888"
              autoFocus={index === 0}
            />
          ))}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleSubmit} style={{ flex: 1, alignItems: 'center'}}>
        <Text style={{ backgroundColor: 'white', padding: 10, marginTop: 80, textAlign: 'center', width: 200, borderRadius: 10, fontSize: 20 }}>Start ride</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ShareOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  title: {
    marginTop: 140,
    fontSize: 25,
    fontWeight: '600',
    color: 'white',
  },
  grid: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 25,
    justifyContent: 'space-between',
  },
  inputBox: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333A5C',
    color: 'white',
    backgroundColor: '#1e1e2d',
    fontSize: 20,
  },
});
