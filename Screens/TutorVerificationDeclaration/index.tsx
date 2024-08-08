import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import CustomButton from '../../Component/CustomButton';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';

const TutorVerificationDeclaration = ({navigation}: any) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [declarationText, setDeclarationText] = useState(
    'I hear by declare that all the details mentioned above are in accordance with the truth and fact as per my knowledge and I hold the responsibility for the correctness of the above mentioned Particulars.'
  );

  const toggleCheckbox = () => {
    setIsChecked(prevState => !prevState);
  };

  const handleNext = async () => {
    if (!isChecked) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please accept the declaration to proceed.',
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
      formData.append('declaration', declarationText);
      console.log("declaration",formData);
      

      const { data } = await axios.post(`${Base_Uri}api/tutor/declaration`, formData,{timeout:9000});
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${data.msg}`,
        position: 'bottom'
      });
      setLoading(false);
      navigation.navigate('VerificationSubmittedSuccess');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: `${error}`,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: Theme.GhostWhite,
        height: '100%',
      }}>
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <Header title={'Declaration'} backBtn navigation={navigation} />
        <View style={{paddingHorizontal: 20}}>
          <View style={{margin: 10}}></View>
          <View style={{flexDirection: 'row', gap: 8,}}>
            {isChecked ? (
              <TouchableOpacity onPress={toggleCheckbox}>
                <MaterialCommunityIcons
                  name="checkbox-outline"
                  color={Theme.darkGray}
                  size={24}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={toggleCheckbox}>
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  color={Theme.darkGray}
                  size={24}
                />
              </TouchableOpacity>
            )}
            <Text
              style={[
                styles.textType3,
                {
                  color: Theme.IronsideGrey,
                  fontFamily: 'Circular Std Book',
                  lineHeight: 20,
                  width: 330,
                },
              ]}>
              {declarationText}
            </Text>
            <View style={{margin: 10}}></View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          paddingHorizontal: 15,
          marginBottom: 80,
        }}>
        <CustomButton
          btnTitle="Next"
          onPress={handleNext}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default TutorVerificationDeclaration;

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
