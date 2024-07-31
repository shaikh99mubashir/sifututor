import { Image, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import CustomDropDown from '../../Component/CustomDropDown';
import CustomButton from '../../Component/CustomButton';
import InputText from '../../Component/InputText';
import CustomLoader from '../../Component/CustomLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import Toast from 'react-native-toast-message';

interface EducationDetailsState {
  educationLevel: string;
  fieldOfStudy: string;
  academicYear: string;
  institutionName: string;
}

interface Errors {
  educationLevel?: string;
  fieldOfStudy?: string;
  academicYear?: string;
  institutionName?: string;
}

const EducationDetails = ({ navigation }: any) => {
  const [educationLevel, setEducationLevel] = useState('');
  const [loading, setLoading] = useState(false)
  const [educationDetails, setEducationDetails] = useState<EducationDetailsState>({
    educationLevel: '',
    fieldOfStudy: '',
    academicYear: '',
    institutionName: '',
  });
console.log("educationDetails",educationDetails);

  const [errors, setErrors] = useState<Errors>({});

  const Education = [
    {
      subject: 'Diploma',
    },
    {
      subject: "Bachelor's Degree",
    },
    {
      subject: "Master's Degree",
    },
    {
      subject: 'Doctorate (PhD)',
    },
    {
      subject: 'Professional Qualifications (e.g., ACCA, CPA)',
    },
  ];

  const handleInputChange = (name: keyof EducationDetailsState, value: string) => {
    setEducationDetails(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevState => ({ ...prevState, [name]: '' }));
  };

  const handleDropdownChange = (value: any) => {
    const selectedEducation = value?.subject || '';
    setEducationLevel(value);
    handleInputChange('educationLevel', selectedEducation);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: Errors = {};

    if (!educationDetails.educationLevel.trim()) {
      newErrors.educationLevel = 'Highest Education is required';
      valid = false;
    }

    if (!educationDetails.fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = 'Field of Study is required';
      valid = false;
    }

    if (!educationDetails.academicYear.trim()) {
      newErrors.academicYear = 'Academic Year is required';
      valid = false;
    }

    if (!educationDetails.institutionName.trim()) {
      newErrors.institutionName = 'Institution Name is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async() => {
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
    formData.append('highest_education', educationDetails.educationLevel);
    formData.append('field_of_study', educationDetails.fieldOfStudy);
    formData.append('academic_year', educationDetails.academicYear);
    formData.append('institution_name', educationDetails.institutionName);

    try {
      const { data } = await axios.post(`${Base_Uri}api/tutor/education`, formData);
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
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <Header title={'Education'} backBtn navigation={navigation} />
        <View style={{ paddingHorizontal: 25 }}>
          <View style={{ margin: 10, }}></View>
          <View>
            <CustomDropDown
              setSelectedSubject={handleDropdownChange}
              selectedSubject={educationLevel}
              ddTitle="Highest Education"
              dropdownPlace={'Select'}
              subject={Education}
              categoryShow={'subject'}
              headingStyle={{ color: Theme.black, }} 
              ddTextStyle={{transform:'none'}}
              
            />
            {errors.educationLevel && <Text style={{ color: 'red' }}>{errors.educationLevel}</Text>}
            <View style={{ margin: 5 }}></View>
            <View>
              <InputText
                label="Field of Study"
                placeholder="Field of Study"
                value={educationDetails.fieldOfStudy}
                onChangeText={(value: string) => handleInputChange('fieldOfStudy', value)}
                error={errors.fieldOfStudy}
              />
            </View>
            <View style={{ margin: 10 }}></View>
            <View>
              <InputText
                label="Academic Year"
                placeholder="Academic Year"
                value={educationDetails.academicYear}
                onChangeText={(value: string) => handleInputChange('academicYear', value)}
                error={errors.academicYear}
                keyboardType="numeric"
              />
            </View>
            <View style={{ margin: 10 }}></View>
            <View>
              <InputText
                label="Institution Name"
                placeholder="Institution Name"
                value={educationDetails.institutionName}
                onChangeText={(value: string) => handleInputChange('institutionName', value)}
                error={errors.institutionName}
              />
            </View>
          </View>
          <View style={{ margin: 25 }}></View>
          <CustomButton
            btnTitle="Save"
            onPress={handleSave}
          />
        </View>
      </ScrollView>
      <CustomLoader visible={loading}/>
    </View>
  );
};

export default EducationDetails;

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
});
