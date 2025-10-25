import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { Toast } from 'toastify-react-native';
import { router } from 'expo-router';
import { socket } from '@/utils/socket';
import { LinearGradient } from 'expo-linear-gradient';

const ShareOtp = () => {
  const ride = useSelector((state: RootState) => state.ride);
  const inputRef = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));

  const handleInput = (text: string, index: number) => {
  const updated = [...otp];

  // Only keep first character (in case user pastes)
  updated[index] = text.slice(-1); 
  setOtp(updated);

  if (text && index < inputRef.current.length - 1) {
    inputRef.current[index + 1]?.focus();
  }
};

const handleKeyPress = (e: any, index: number) => {
  if (e.nativeEvent.key === 'Backspace') {
    const updated = [...otp];
    if (otp[index] === '') {
      // Move focus to previous if current is empty
      if (index > 0) {
        updated[index - 1] = '';
        setOtp(updated);
        inputRef.current[index - 1]?.focus();
      }
    } else {
      // If current has value, just clear it
      updated[index] = '';
      setOtp(updated);
    }
  }
};


  const handlePaste = async () => {
    const paste = await Clipboard.getStringAsync();
    if (!paste) return;
    const pasteArray = paste.trim().split('').slice(0, otp.length);
    const updated = [...otp];
    pasteArray.forEach((char, i) => (updated[i] = char));
    setOtp(updated);
    const nextIndex = pasteArray.length < otp.length ? pasteArray.length : otp.length - 1;
    setTimeout(() => inputRef.current[nextIndex]?.focus(), 50);
  };

  const handleSubmit = async () => {
    if (otp.join('') === ride.otp?.toString()) {
      socket.emit('ride_start', { msg: 'ride started' });
      router.push('/screens/rideStarted');
    } else {
      Toast.show({ text1: 'Enter valid OTP', type: 'error' });
    }
  };

  return (
    <LinearGradient colors={['#4f46e5', '#3b82f6']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.heading}>Verify Your Ride</Text>
        <Text style={styles.subheading}>Enter the 4-digit OTP sent to you</Text>

        <TouchableOpacity onLongPress={handlePaste} activeOpacity={1}>
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  if (el) inputRef.current[index] = el;
                }}
                value={value}
                onChangeText={(text) => handleInput(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                style={styles.otpBox}
                maxLength={1}
                keyboardType="number-pad"
                textAlign="center"
                placeholder="-"
                placeholderTextColor="#888"
                autoFocus={index === 0}
              />
            ))}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn} activeOpacity={0.8}>
          <Text style={styles.submitText}>Start Ride</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ShareOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 60 : 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#d1d5db',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginHorizontal: 20,
  },
  otpBox: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#ffffff20',
    borderWidth: 2,
    borderColor: '#ffffff50',
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 60,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 3,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },
});
