import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
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
  teachingExperience: string;
}

interface Errors {
  teachingExperience?: string;
  selectedCategory?: string;
  mode?: string;
  selectedCity?: string;
}

const ServicePreference = ({ navigation }: any) => {
  const [selectedState, setSelectedState] = useState('');
  const [mode, setMode] = useState<any>([]);
  const [selectedCity, setSelectedCity] = useState<any>([]);
  const [searchCityData, setSearchCityData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>([]);
  const [searchCategoryData, setSearchCategoryData] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [servicePreference, setServicePreference] = useState<ServicePreferenceState>({
    teachingExperience: '',
  });

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
    const selectedSubjects = value.map((item: any) => item.subject);
    if (type === 'category') {
      setSelectedCategory(selectedSubjects);
    } else if (type === 'mode') {
      setMode(selectedSubjects);
    } else if (type === 'city') {
      setSelectedCity(selectedSubjects);
    }
    setErrors(prevState => ({ ...prevState, [type]: '' })); // Clear error for the specific field
  };

  const handleSearchData = (text: string, type: string) => {
    if (type === 'category') {
      let myData = category.filter((e: any) =>
        e?.subject?.toLowerCase()?.includes(text?.toLowerCase())
      );
      setSearchCategoryData(myData);
    } else {
      let myData = city.filter((e: any) =>
        e?.subject?.toLowerCase()?.includes(text?.toLowerCase())
      );
      setSearchCityData(myData);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: Errors = {};

    if (!servicePreference.teachingExperience.trim()) {
      newErrors.teachingExperience = 'Teaching Experience is required';
      valid = false;
    }

    if (selectedCategory.length === 0) {
      newErrors.selectedCategory = 'Level is required';
      valid = false;
    }

    if (mode.length === 0) {
      newErrors.mode = 'Mode of Tutoring is required';
      valid = false;
    }

    if (selectedCity.length === 0) {
      newErrors.selectedCity = 'Preferable Location is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
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

      formData.append('tutor_id', tutorID);
      selectedCategory.forEach((item: any, index: any) => {
        formData.append(`categories[${index}]`, item);
      });
      mode.forEach((item: any, index: any) => {
        formData.append(`modes_of_tutoring[${index}]`, item);
      });
      selectedCity.forEach((item: any, index: any) => {
        formData.append(`preferable_locations[${index}]`, item);
      });
      formData.append('teaching_experiences', servicePreference.teachingExperience);

      const { data } = await axios.post(`${Base_Uri}api/tutor/service-preferences`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${data.msg}`,
        position: 'bottom',
      });
      setLoading(false);
      navigation.navigate('TutorVerificationProcess');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: `${error.response.status}`,
        text2:  `${error.message}`,
        position: 'bottom',
      });

      if (error.response) {
        console.log('Server responded with data:', error.response.data);
        console.log('Status code:', error.response.status);
        console.log('Headers:', error.response.headers);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error setting up the request:', error.message);
      }
      setLoading(false);
    }
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (key: string) => {
    // setOpenDropdown(prev => (prev === key ? null : key));
    if (openDropdown === key) {
      setOpenDropdown(null); // Close dropdown if it's already open
    } else {
      setOpenDropdown(key); // Open the specified dropdown
    }
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null); // Close all dropdowns
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      closeAllDropdowns();
    }}>
      <View style={{ backgroundColor: Theme.GhostWhite, height: '100%' }}>
        <KeyboardAvoidingView behavior="height">
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
            <Header title={'Service Preference'} backBtn navigation={navigation} />
            <View style={{ paddingHorizontal: 25 }}>
              <View style={{ margin: 10 }}></View>
              <View>
                <MultiSelectDropDown
                  key="category"
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
                  serviceDD={openDropdown === "category"}
                  handleDropdownToggle={() => handleDropdownToggle("category")}
                />
                {errors.selectedCategory && (
                  <Text style={{ color: 'red' }}>{errors.selectedCategory}</Text>
                )}

                <MultiSelectDropDown
                  key="mode"
                  setSelectedSubject={(value: any) => handleDropdownChange(value, 'mode')}
                  selectedSubject={mode}
                  ddTitle="Mode of Tutoring"
                  dropdownPlace={'Select Mode'}
                  subject={modeOfTutoringOptions}
                  categoryShow={'subject'}
                  headingStyle={{ color: Theme.black, textTransform: 'none' }}
                  serviceDD={openDropdown === "mode"}
                  handleDropdownToggle={() => handleDropdownToggle("mode")}
                />
                {errors.mode && <Text style={{ color: 'red' }}>{errors.mode}</Text>}

                <MultiSelectDropDown
                  key="city"
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
                  serviceDD={openDropdown === "city"}
                  handleDropdownToggle={() => handleDropdownToggle("city")}
                />
                {errors.selectedCity && <Text style={{ color: 'red' }}>{errors.selectedCity}</Text>}

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
                    style={{
                      height: 120,
                      justifyContent: 'flex-start',
                      color: Theme.black,
                    }}
                    placeholder="Teaching Experience"
                    value={servicePreference.teachingExperience}
                    placeholderTextColor={Theme.gray}
                    numberOfLines={10}
                    multiline={true}
                    onChangeText={(text: string) => handleInputChange('teachingExperience', text)}
                    onFocus={() => {
                      closeAllDropdowns();
                    }}
                  />
                </View>
                {errors.teachingExperience && (
                  <Text style={{ color: 'red' }}>{errors.teachingExperience}</Text>
                )}

                <View style={{ marginTop: 20 }}>
                  <CustomButton loading={loading} onPress={handleSave} btnTitle="Save" />
                </View>
              </View>
            </View>
          </ScrollView>
          {/* {loading && <CustomLoader />} */}
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ServicePreference;

const styles = StyleSheet.create({
  textAreaContainer: {
    backgroundColor: Theme.white,
    padding: 20,
  },
});
