import { Image, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import InputText from '../../Component/InputText';
import CustomButton from '../../Component/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../Component/CustomLoader';

interface TutorBioDetails {
  fullName: string;
  phoneNumber: string;
  email: string;
  icNumber: string;
  residentialAddress: string;
  postalCode: string;
}

interface Errors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  icNumber?: string;
  residentialAddress?: string;
  postalCode?: string;
}

const BioDetails = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [tutorBioDetails, setTutorBioDetails] = useState<TutorBioDetails>({
    fullName: '',
    phoneNumber: '',
    email: '',
    icNumber: '',
    residentialAddress: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (name: keyof TutorBioDetails, value: string) => {
    setTutorBioDetails(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevState => ({ ...prevState, [name]: '' }));
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: Errors = {};

    if (!tutorBioDetails.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      valid = false;
    }

    if (!tutorBioDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
      valid = false;
    }

    if (!tutorBioDetails.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(tutorBioDetails.email.trim())) {
      newErrors.email = 'Enter a valid Email';
      valid = false;
    }

    if (!tutorBioDetails.icNumber.trim()) {
      newErrors.icNumber = 'IC Number is required';
      valid = false;
    }

    if (!tutorBioDetails.residentialAddress.trim()) {
      newErrors.residentialAddress = 'Residential Address is required';
      valid = false;
    }

    if (!tutorBioDetails.postalCode.trim()) {
      newErrors.postalCode = 'Postal Code is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handelBioData = async () => {
    if (!validateForm()) {
      // Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields correctly.',
        position: 'bottom',
      });
      return;
    }

    setLoading(true);
    const login: any = await AsyncStorage.getItem('loginAuth');
    const loginData = JSON.parse(login);
    const { tutorID } = loginData;
    const formData = new FormData();
    formData.append('tutor_id', tutorID);
    formData.append('full_name', tutorBioDetails.fullName);
    formData.append('phone_number', tutorBioDetails.phoneNumber);
    formData.append('email', tutorBioDetails.email);
    formData.append('ic_number', tutorBioDetails.icNumber);
    formData.append('residential_address', tutorBioDetails.residentialAddress);
    formData.append('postal_code', tutorBioDetails.postalCode);

    try {
      const { data } = await axios.post(`${Base_Uri}api/tutor/bio-details`, formData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: data.msg,
        position: 'bottom',
      });
      setLoading(false);
      navigation.navigate('TutorVerificationProcess');
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Network Error',
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: Theme.GhostWhite, height: '100%' }}>
        <Header title={'Bio Details'} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 25 }}>
          <View style={{ margin: 10 }}></View>
          <View>
            <InputText
              label="Full Name*"
              placeholder="Enter Full Name*"
              value={tutorBioDetails.fullName}
              onChangeText={(value: string) => handleInputChange('fullName', value)}
              error={errors.fullName}
            />
            <View style={{ margin: 10 }}></View>
            <InputText
              label="Phone Number*"
              placeholder="Enter Phone Number*"
              value={tutorBioDetails.phoneNumber}
              onChangeText={(value: string) => handleInputChange('phoneNumber', value)}
              keyboardType="numeric"
              error={errors.phoneNumber}
            />
            <View style={{ margin: 10 }}></View>
            <InputText
              label="Email*"
              placeholder="Enter Email*"
              value={tutorBioDetails.email}
              onChangeText={(value: string) => handleInputChange('email', value)}
              error={errors.email}
            />
            <View style={{ margin: 10 }}></View>
            <InputText
              label="IC Number*"
              placeholder="Enter IC Number*"
              value={tutorBioDetails.icNumber}
              onChangeText={(value: string) => handleInputChange('icNumber', value)}
              keyboardType="numeric"
              error={errors.icNumber}
            />
            <View style={{ margin: 10 }}></View>
            <InputText
              label="Residential Address*"
              placeholder="Enter Residential Address*"
              value={tutorBioDetails.residentialAddress}
              onChangeText={(value: string) => handleInputChange('residentialAddress', value)}
              error={errors.residentialAddress}
            />
            <View style={{ margin: 10 }}></View>
            <InputText
              label="Postal Code*"
              placeholder="Enter Postal Code*"
              value={tutorBioDetails.postalCode}
              onChangeText={(value: string) => handleInputChange('postalCode', value)}
              error={errors.postalCode}
            />
            <View style={{ margin: 10 }}></View>
          </View>
          <View style={{ margin: 8 }}></View>
          <CustomButton
            btnTitle="Save"
            onPress={handelBioData}
            loading={loading}
          />
          <View style={{ margin: 10 }}></View>
        </View>
      </ScrollView>
      <CustomLoader visible={loading}/>
    </View>
  );
};

export default BioDetails;

const styles = StyleSheet.create({
  textType3: {
    color: Theme.Dune,
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
    fontStyle: 'normal',
  },
  textType1: {
    fontWeight: '500',
    fontSize: 26,
    color: Theme.Black,
    fontFamily: 'Circular Std Medium',
    lineHeight: 24,
    fontStyle: 'normal',
  },
  textAreaContainer: {
    borderRadius: 16,
  },
  textArea: {
    borderRadius: 10,
    height: 100,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontFamily: 'Circular Std',
  },
});
