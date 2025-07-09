import { View, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import GradientBlock from '@/components/GradientBlock';

const AddMovements = () => {
  return (
      <View className='flex-1 bg-[#B587A8]'>
          <GradientBlock/>
          <SafeAreaView className='flex-1' edges={['top']}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1,}} keyboardVerticalOffset={-10}>
              <ScrollView
                // content container
                className="px-6 pt-2 h-full flex-1" keyboardShouldPersistTaps="handled" contentContainerStyle={{alignItems: 'center', paddingBottom: 32,}} showsVerticalScrollIndicator={false}>
                
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
  );
};

export default AddMovements;