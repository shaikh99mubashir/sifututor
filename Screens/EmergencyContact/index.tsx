import { Image, ScrollView, StyleSheet, Text, TextInput, View, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import InputText from '../../Component/InputText';
import CustomDropDown from '../../Component/CustomDropDown';
import CustomButton from '../../Component/CustomButton';
import CustomLoader from '../../Component/CustomLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import Toast from 'react-native-toast-message';

interface EmergencyContactDetails {
  contactName: string;
  relationship: string;
  contactNumber: string;
}

interface Errors {
  contactName?: string;
  relationship?: string;
  contactNumber?: string;
}

const EmergencyContact = ({ navigation }: any) => {
  const [selectedRelationShip, setSelectedRelationShip] = useState('');
  const [loading, setLoading] = useState(false)
  const [emergencyContactDetails, setEmergencyContactDetails] = useState<EmergencyContactDetails>({
    contactName: '',
    relationship: '',
    contactNumber: '',
  });

  console.log("selectedState", selectedRelationShip);


  console.log("emergencyContactDetails", emergencyContactDetails);

  const [errors, setErrors] = useState<Errors>({});

  const Relationship = [
    {
      subject: 'Parent',
    },
    {
      subject: 'Spouse',
    },
    {
      subject: 'Sibling',
    },
    {
      subject: 'Friend',
    },
    {
      subject: 'Others',
    },
  ];

  const handleInputChange = (name: keyof EmergencyContactDetails, value: string) => {
    setEmergencyContactDetails(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevState => ({ ...prevState, [name]: '' }));
  };

  const handleDropdownChange = (value: any) => {
    const selectedRelationship = value?.subject || '';
    setSelectedRelationShip(value);
    handleInputChange('relationship', selectedRelationship);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: Errors = {};

    if (!emergencyContactDetails.contactName.trim()) {
      newErrors.contactName = 'Emergency Contact Name is required';
      valid = false;
    }

    if (!emergencyContactDetails.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
      valid = false;
    }

    if (!emergencyContactDetails.contactNumber.trim()) {
      newErrors.contactNumber = 'Emergency Contact Number is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
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
    setLoading(true)
    const login: any = await AsyncStorage.getItem('loginAuth');
    const loginData = JSON.parse(login);
    const { tutorID } = loginData;
    const formData = new FormData();
    formData.append('tutor_id', tutorID);
    formData.append('emergency_contact_name', emergencyContactDetails.contactName);
    formData.append('relationship', emergencyContactDetails.relationship);
    formData.append('emergency_contact_number', emergencyContactDetails.contactNumber);

    try {
      const { data } = await axios.post(`${Base_Uri}api/tutor/emergency-contact`, formData);
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
        <KeyboardAvoidingView behavior="height">
    <View style={{ backgroundColor: Theme.GhostWhite, height: '100%' }}>


      <Header title={'Emergency Contact'} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <View style={{ paddingHorizontal: 25 }}>
            <View style={{ margin: 10 }}></View>
            <View>
              <InputText
                label="Emergency Contact Name"
                placeholder="Emergency Contact Name"
                value={emergencyContactDetails.contactName}
                onChangeText={(value: string) => handleInputChange('contactName', value)}
                error={errors.contactName}
              />
              <View style={{ margin: 8 }}></View>
              <CustomDropDown
                setSelectedSubject={handleDropdownChange}
                selectedSubject={selectedRelationShip}
                ddTitle="Relationship"
                dropdownPlace="Select"
                subject={Relationship}
                categoryShow="subject"
                headingStyle={{
                  color: Theme.black, marginVertical: 5,
                  marginHorizontal: 0,
                }}
              />

              {errors.relationship && <Text style={{ color: 'red' }}>{errors.relationship}</Text>}
              <View style={{ margin: 6 }}></View>
              <InputText
                label="Emergency Contact Number"
                placeholder="+60 149824799"
                value={emergencyContactDetails.contactNumber}
                onChangeText={(value: string) => handleInputChange('contactNumber', value)}
                keyboardType="numeric"
                error={errors.contactNumber}
              />
            </View>
            <View style={{ margin: 25 }}></View>
            <CustomButton
              btnTitle="Save"
              onPress={handleSave}
              loading={loading}
            />
            <View style={{ margin: 10 }}></View>
          </View>
      </ScrollView>
      {/* <CustomLoader visible={loading}/> */}
    </View>
        </KeyboardAvoidingView>
  );
};

export default EmergencyContact;

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
