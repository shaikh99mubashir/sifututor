import { Image, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import CustomDropDown from '../../Component/CustomDropDown';
import CustomButton from '../../Component/CustomButton';
import filterContext from '../../context/filterContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../Component/CustomLoader';
import MultiSelectDropDown from '../../Component/MultiSelectDropDown';

interface ServicePreferenceState {
  // category?: string;
  // modeOfTutoring?: string;
  // preferableLocation?: string;
  teachingExperience: string;
}

interface Errors {
  // category?: string;
  // modeOfTutoring?: string;
  // preferableLocation?: string;
  teachingExperience?: string;
}

const ServicePreference = ({ navigation }: any) => {
  const [selectedState, setSelectedState] = useState('');
  const [mode, setMode] = useState<any>('');
  const [selectedCity, setSelectedCity] = useState<any>('');
  const [searchCityData, setSearchCityData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>([]);
  const [searchCategoryData, setSearchCategoryData] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCity, setFilterCity] = useState('');
  console.log(selectedCategory, '=====>selectedCategory');

  const [servicePreference, setServicePreference] = useState<ServicePreferenceState>({
    // category: '',
    // modeOfTutoring: '',
    // preferableLocation: '',
    teachingExperience: '',
  });
  console.log("servicePreference", servicePreference);

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const filter = useContext(filterContext);
  let { subjects, city, state, category } = filter;

  const modeOfTutoringOptions = [
    {
      subject: 'Online',
    },
    {
      subject: 'In-person',
    },
  ];

  const handleInputChange = (name: keyof ServicePreferenceState, value: string) => {
    setServicePreference(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevState => ({ ...prevState, [name]: '' }));
  };

  const handleDropdownChange = (value: any, type: string) => {
    const selectedSubject = value?.subject || '';
    if (type === 'category') {
      // setSelectedCategory(value);
      const selectedSubjects = value.map((item: any) => item.subject);
      console.log("selectedSubjects====>",selectedSubjects);
      
      setSelectedCategory(selectedSubjects);      
      console.log("selectedCategory",selectedCategory);
      // handleInputChange('category', selectedSubject);
    } else if (type === 'mode') {
      const selectedMode = value.map((item: any) => item.subject);
      // setSelectedCategory(selectedSubjects);  
      setMode(selectedMode);
      // handleInputChange('modeOfTutoring', selectedSubject);
    } else if (type === 'city') {
      const selectedCity = value.map((item: any) => item.subject);
      setSelectedCity(selectedCity);
      // handleInputChange('preferableLocation', selectedSubject);
    }
  };

  const handleSearchData = (text: string, type: string) => {
    if (type === 'category') {
      let myData = category.filter((e: any) => e?.subject?.toLowerCase()?.includes(text?.toLowerCase()));
      setSearchCategoryData(myData);
    } else {
      let myData = city.filter((e: any) => e?.subject?.toLowerCase()?.includes(text?.toLowerCase()));
      setSearchCityData(myData);
    }
  };
  const [levelError, setLevelError] = useState<any>()
  const validateCategorySelection = () => {
    if (selectedCategory.length === 0) {
      setLevelError((prevErrors:any) => ({
        ...prevErrors,
        category: 'Please select a level',
      }));
      return false;
    } else {
      setLevelError((prevErrors:any) => ({
        ...prevErrors,
        category: '',
      }));
      return true;
    }
  };
  const validateForm = () => {
    let valid = true;
    const newErrors: Errors = {};
 

       if (!servicePreference.teachingExperience.trim()) {
      newErrors.teachingExperience = 'Teaching Experience is required';
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

    setLoading(true);
    try {
      const login: any = await AsyncStorage.getItem('loginAuth');
      let loginData = JSON.parse(login);
      let { tutorID } = loginData;
      let formData = new FormData();
      console.log("formData",formData);
      
      formData.append('tutor_id', tutorID);
      selectedCategory.forEach((item:any, index:any) => {
        formData.append(`categories[${index}]`, item);
      });
      mode.forEach((item:any, index:any) => {
        formData.append(`modes_of_tutoring[${index}]`, item);
      });
      selectedCity.forEach((item:any, index:any) => {
        formData.append(`preferable_locations[${index}]`, item);
      });
      formData.append('teaching_experiences', servicePreference.teachingExperience);

      const { data } = await axios.post(`${Base_Uri}api/tutor/service-preferences`, formData,  {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${data.msg}`,
        position: 'bottom'
      });
      setLoading(false);
      navigation.navigate('TutorVerificationProcess');
    } catch (error:any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Network Error',
        position: 'bottom'
      });
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log('Server responded with data:', error.response.data);
        console.log('Status code:', error.response.status);
        console.log('Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error setting up the request:', error.message);
      }
      setLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: Theme.GhostWhite, height: '100%' }}>
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <Header title={'Service Preference'} backBtn navigation={navigation} />
        <View style={{ paddingHorizontal: 25 }}>
          <View style={{ margin: 10 }}></View>
          <View>
            <MultiSelectDropDown
              setSelectedSubject={(value: any) => handleDropdownChange(value, 'category')}
              search={"category"}
              dataShow={5}
              searchData={searchCategoryData}
              searchFunc={(text: string) => handleSearchData(text, 'category')}
              selectedSubject={selectedCategory}
              ddTitle="Level"
              headingStyle={{ color: Theme.black }}
              dropdownPlace={filterCategory ? filterCategory : "Select Level"}
              dropdownContainerStyle={{ paddingVertical: 15 }}
              subject={category}
              categoryShow={"subject"}
            />

            {levelError && <Text style={{ color: 'red' }}>{levelError}</Text>}
            <MultiSelectDropDown
              setSelectedSubject={(value: any) => handleDropdownChange(value, 'mode')}
              selectedSubject={mode}
              ddTitle="Mode of Tutoring"
              dropdownPlace={'Select Mode'}
              subject={modeOfTutoringOptions}
              categoryShow={'subject'}
              headingStyle={{ color: Theme.black, textTransform: 'none' }}
            />
            {/* {errors?.modeOfTutoring && <Text style={{ color: 'red' }}>{errors.modeOfTutoring}</Text>} */}
            <MultiSelectDropDown
              ddTitle="Preferable Tutoring Location"
              search={"city"}
              searchData={searchCityData}
              searchFunc={(text: string) => handleSearchData(text, 'city')}
              setSelectedSubject={(value: any) => handleDropdownChange(value, 'city')}
              selectedSubject={selectedCity}
              headingStyle={{ color: Theme.black }}
              dropdownPlace={filterCity ? filterCity : "Select City"}
              dropdownContainerStyle={{ paddingVertical: 15 }}
              subject={city}
              categoryShow={"subject"}
            />
           
            <View style={{ margin: 3 }}></View>
            <View
              style={[
                styles.textAreaContainer,
                {
                  marginTop: 5,
                  borderRadius: 10,
                  marginHorizontal: 2,
                },
              ]}>
              <TextInput
                placeholder="Briefly explain your previous teaching experience"
                multiline={true}
                maxLength={300}
                onChangeText={(e: string) => handleInputChange('teachingExperience', e)}
                style={[
                  styles.textArea,
                  {
                    backgroundColor: Theme.white,
                    padding: 12,
                    color: Theme.gray,
                    fontFamily: 'Circular Std Medium',
                    fontSize: 14,
                  },
                ]}
                underlineColorAndroid="transparent"
                placeholderTextColor="grey"
              />
            </View>
            {errors.teachingExperience && <Text style={{ color: 'red' }}>{errors.teachingExperience}</Text>}
          </View>
          <View style={{ margin: 10 }}></View>
          <CustomButton
            btnTitle="Save"
            onPress={handleSave}
          />
        </View>
      </ScrollView>
      <CustomLoader visible={loading} />
    </View>
  );
};

export default ServicePreference;

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
