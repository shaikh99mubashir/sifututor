import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import axios from 'axios';
import { Theme } from '../../constant/theme';
import { Base_Uri } from '../../constant/BaseUri';
const Login = ({ navigation }:any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginPress = () => {
    if (!phoneNumber) {
      ToastAndroid.show('Kindly Enter Phone Number', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      ToastAndroid.show(
        'Request timeout: Please check your internet connection',
        ToastAndroid.SHORT
      );
    }, 30000);

    const phoneNumberWithCountryCode = phoneNumber;

    axios
      .get(`${Base_Uri}loginAPI/${phoneNumberWithCountryCode}`, {
        timeout: 30000,
      })
      .then(({ data }) => {
        clearTimeout(timeoutId);
        setLoading(false);

        if (data?.status === 404) {
          ToastAndroid.show(data.msg, ToastAndroid.SHORT);
          return;
        }

        if (data?.status === 200) {
        //   ToastAndroid.show('Enter verification code to continue.', ToastAndroid.SHORT);
          navigation.navigate('Verification', data);
        }
      })
      .catch(() => {
        setLoading(false);
        ToastAndroid.show(
          'Request timeout: Please check your internet connection',
          ToastAndroid.LONG
        );
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Enter your{'\n'}mobile number</Text>
      <Text style={styles.subHeaderText}>
        A verification code will be sent to{'\n'}this mobile number
      </Text>
      <View style={styles.phoneInputContainer}>
        <PhoneInput
          placeholder="Enter Your Number"
          defaultValue={phoneNumber}
          defaultCode="MY"
          layout="first"
          autoFocus
          textInputStyle={styles.phoneNumberInput}
          textInputProps={{ placeholderTextColor: Theme.gray }}
          codeTextStyle={styles.codeTextStyle}
          containerStyle={styles.phoneNumberView}
          textContainerStyle={styles.textContainerStyle}
          onChangeFormattedText={setPhoneNumber}
        />
      </View>
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity onPress={handleLoginPress} style={styles.submitButton}>
          {loading ? (
            <ActivityIndicator color={Theme.white} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 26,
    color: 'black',
    fontFamily: 'Circular Std Book',
  },
  subHeaderText: {
    fontSize: 14,
    color: 'black',
    marginTop: 14,
    fontFamily: 'Circular Std Book',
  },
  phoneInputContainer: {
    marginTop: 20,
  },
  phoneNumberInput: {
    color: Theme.black,
    height: 50,
  },
  codeTextStyle: {
    marginLeft: -15,
    paddingLeft: -55,
    color: 'black',
  },
  phoneNumberView: {
    width: '100%',
    backgroundColor: 'white',
    borderColor: Theme.gray,
    borderRadius: 10,
    borderWidth: 1,
  },
  textContainerStyle: {
    height: 60,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'transparent',
  },
  submitButtonContainer: {
    borderWidth: 1,
    borderColor: Theme.white,
    marginVertical: 20,
    width: '100%',
  },
  submitButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: Theme.darkGray,
    borderRadius: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
});
