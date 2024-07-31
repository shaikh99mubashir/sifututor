import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import CustomButton from '../../Component/CustomButton';
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import CustomLoader from '../../backup24-07-2024/Component/CustomLoader';

const VerificationDocumentsUpload = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState<any>({
    resume: null,
    education_transcript: null,
    formal_photo: null,
    identity_card: null,
  });

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    const allUploaded = Object.values(documents).every(doc => doc !== null);
    setIsButtonEnabled(allUploaded);
  }, [documents]);

  const uploadPdf = async (docType:any) => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      console.log("result ", result[0].name);
      console.log("result ", result[0].type);
      console.log("result ", result[0].uri);

      setDocuments((prevDocs:any) => ({
        ...prevDocs,
        [docType]: result[0],
      }));

    } catch (err) {
      console.log("err---->", err);
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled the picker");
      } else {
        Toast.show({
          type: 'error',
          text1: 'Unknown Error: ' + err,
        });
      }
    }
  };

  const handleSave = async () => {
    const missingDocuments = Object.entries(documents)
      .filter(([key, value]) => value === null)
      .map(([key]) => key.replace('_', ' '));

    if (missingDocuments.length > 0) {
      missingDocuments.forEach(doc => {
        Toast.show({
          type: 'error',
          text1: 'Document Missing',
          text2: `${doc} is not uploaded.`,
        });
      });
      return;
    }
    setLoading(true)
    try {
      const login:any = await AsyncStorage.getItem('loginAuth');
      let loginData = JSON.parse(login);
      let { tutorID } = loginData;

      let formData = new FormData();
      formData.append("tutor_id", tutorID);
      formData.append('resume', {
        uri: documents.resume.uri,
        type: documents.resume.type,
        name: documents.resume.name,
      });
      formData.append('education_transcript', {
        uri: documents.education_transcript.uri,
        type: documents.education_transcript.type,
        name: documents.education_transcript.name,
      });
      formData.append('formal_photo', {
        uri: documents.formal_photo.uri,
        type: documents.formal_photo.type,
        name: documents.formal_photo.name,
      });
      formData.append('identity_card_front', {
        uri: documents.identity_card.uri,
        type: documents.identity_card.type,
        name: documents.identity_card.name,
      });

      const { data } = await axios.post(`${Base_Uri}api/tutor/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log("data", data);
      setLoading(false)
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${data.msg}`,
        position: 'bottom'
      });
      navigation.replace('TutorVerificationProcess');
    } catch (error:any) {
      console.log("error", error);
      if (error.response) {
        console.log('Server responded with data:', error.response.data);
        console.log('Status code:', error.response.status);
        console.log('Headers:', error.response.headers);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error setting up the request:', error.message);
      }
      Toast.show({
        type: 'error',
        text1: 'Internal Server Error',
        position: 'bottom'
      });
      setLoading(false)
    }
  };

  return (
    <View
      style={{
        backgroundColor: Theme.GhostWhite,
        height: '100%',
      }}>
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <Header title={'Upload Documents'} backBtn navigation={navigation} />
        <View style={{ paddingHorizontal: 25 }}>

          <View style={{ margin: 10 }}></View>

          <TouchableOpacity
            onPress={() => uploadPdf('resume')}
            activeOpacity={0.8}
            style={styles.uploadButton}>
            <Text style={styles.textType3}>Resume</Text>
            <Entypo
              name={documents.resume ? "check" : "upload-to-cloud"}
              color={Theme.IronsideGrey}
              size={25}
            />
          </TouchableOpacity>

          <TouchableOpacity
          activeOpacity={0.8}
            onPress={() => uploadPdf('education_transcript')}
            style={styles.uploadButton}>
            <Text style={styles.textType3}>Education Transcript</Text>
            <Entypo
              name={documents.education_transcript ? "check" : "upload-to-cloud"}
              color={Theme.IronsideGrey}
              size={25}
            />
          </TouchableOpacity>

          <TouchableOpacity
          activeOpacity={0.8}
            onPress={() => uploadPdf('formal_photo')}
            style={styles.uploadButton}>
            <Text style={styles.textType3}>Formal Photo</Text>
            <Entypo
              name={documents.formal_photo ? "check" : "upload-to-cloud"}
              color={Theme.IronsideGrey}
              size={25}
            />
          </TouchableOpacity>

          <TouchableOpacity
          activeOpacity={0.8}
            onPress={() => uploadPdf('identity_card')}
            style={styles.uploadButton}>
            <Text style={styles.textType3}>Identity Card Front and Back</Text>
            <Entypo
              name={documents.identity_card ? "check" : "upload-to-cloud"}
              color={Theme.IronsideGrey}
              size={25}
            />
          </TouchableOpacity>

          <View style={{ margin: 25 }}></View>
          <CustomButton
            btnTitle="Save"
            onPress={handleSave}
            // disabled={!isButtonEnabled}
          />
        </View>
      </ScrollView>
      <CustomLoader visible={loading}/>
    </View>
  );
};

const styles = StyleSheet.create({
  textType3: {
    color: Theme.Dune,
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
    fontStyle: 'normal',
  },
  uploadButton: {
    backgroundColor: Theme.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 10,
    height: 60,
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default VerificationDocumentsUpload;
