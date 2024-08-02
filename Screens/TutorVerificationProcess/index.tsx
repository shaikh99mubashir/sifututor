import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import CustomButton from '../../Component/CustomButton';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import CustomLoader from '../../Component/CustomLoader';

const TutorVerificationProcess = ({ navigation }: any) => {
  const [currentIndexJT, setCurrentIndexJT] = useState(0);
  const data = [
    {
      id: '1',
      title: 'Service Preferences',
      status: 'Required',
      screen: 'ServicePreference',
    },
    {
      id: '2',
      title: 'Bio Details',
      status: 'Required',
      screen: 'BioDetails',
    },
    {
      id: '3',
      title: 'Emergency Contact',
      status: 'Required',
      screen: 'EmergencyContact',
    },
    {
      id: '4',
      title: 'Education',
      status: 'Required',
      screen: 'EducationDetails',
    },
    {
      id: '5',
      title: 'Documents',
      status: 'Required',
      screen: 'VerificationDocumentsUpload',
    },
    {
      id: '6',
      title: 'Declaration',
      status: 'Required',
      screen: 'TutorVerificationDeclaration',
    },
  ];

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate(item.screen)}
        style={{
          backgroundColor: item.status == false ? Theme.white : Theme.darkGray,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
          borderRadius: 10,
          height: 60,
          alignItems: 'center',
          marginVertical: 5,
        }}>
        <Text style={[styles.textType3, { color: item.status == false ? Theme.black : Theme.white }]}>{item.title}</Text>
        {item.status == false ?
          <Text
            style={[
              styles.textType3,
              { color: Theme.IronsideGrey, fontFamily: 'Circular Std Book' },
            ]}>
            Required
          </Text>
          :
          <AntDesign name='checkcircle' size={20} color={Theme.white} />
        }
      </TouchableOpacity>
    )
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {verifySteps.map((item: any, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              item.status == true ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>
    );
  };

  const [verifySteps, setVerifyStep] = useState([]);
  const focus = useIsFocused();
  const [loading, setLoading] = useState(false);

  const checkTutorVerification = async () => {
    setLoading(true);
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData = JSON.parse(login);
    let { tutorID } = loginData;
    let formData = new FormData();

    formData.append('tutor_id', tutorID);
    axios
      .post(`${Base_Uri}api/tutor/checkTutorData`, formData)
      .then(({ data }) => {
        const { dataStatus } = data;
        console.log("data hello world", data);
        setVerifyStep(dataStatus);
        setLoading(false);
      })
      .catch(error => {
        console.log("error", error);
        setLoading(false);
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    checkTutorVerification();
  }, [focus]);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    const allTrue = verifySteps.every((item: any) => item.status);
    setIsButtonEnabled(allTrue);
  }, [verifySteps]);

  return (
    <View
      style={{
        backgroundColor: Theme.GhostWhite,
        height: '100%',
      }}>
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <Header
          title={'Tutor Verification'}
          backBtn
          navigation={navigation}
          needHelp
        />
        {verifySteps.length > 0 && (
          <View style={{ paddingHorizontal: 25, marginBottom: 40 }}>
            <View style={{ margin: 15 }}></View>
            {isButtonEnabled ? (
              <View style={{justifyContent:'center', alignItems:'center'}}>
               <Image
          source={require('../../Assets/Images/thankyou.png')}
          style={{ resizeMode: 'contain', marginTop: 20, alignSelf: 'center' }}
        />
        <View style={{alignItems:'center', marginTop:30}}>
          <Text style={[styles.textType1,{lineHeight:30}]}>
          Thank You!
          </Text>
          <View style={{margin:5}}></View>
          <Text style={styles.textType3}>
          We have Received Your Application.
          </Text>
        </View>
      
      <View style={{width:'80%', marginBottom:70}}>
          <View style={{margin:20}}></View>
          <CustomButton btnTitle='Done' onPress={() => navigation.navigate('Home')} />
          <View style={{margin:20}}></View>
          <Text style={[styles.textType3,{textAlign:'center', fontFamily: 'Circular Std Book',}]}>
          We will reach out to you once your profile has been verified.
          </Text>
      </View></View>
            ) : (
              <>
                <Text style={[styles.textType1,{lineHeight:30}]}>You are Applying as a Tutor</Text>
                <View style={{ margin: 5 }}></View>
                <Text style={styles.textType3}>
                  Secure your tutoring opportunities by ensuring all your documents
                  are up-to-date.
                </Text>
                <View style={{ margin: 5 }}></View>
                {renderPagination()}
                <View style={{ margin: 10 }}></View>
                <View>
                  <FlatList
                    data={verifySteps}
                    renderItem={renderItem}
                    keyExtractor={(items: any, index: number): any => index}
                    pagingEnabled
                  />
                </View>
                <View style={{ margin: 15 }}></View>
                <CustomButton
                  btnTitle="Submit"
                  backgroundColor={isButtonEnabled ? Theme.darkGray : Theme.DustyGrey}
                  onPress={() => navigation.navigate('VerificationSubmittedSuccess')}
                  disabled={!isButtonEnabled}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
      <CustomLoader visible={loading} />
    </View>
  );
};

export default TutorVerificationProcess;

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
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
    gap: 8,
  },
  indicator: {
    width: 50,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.LightPattensBlue, // Inactive indicator color
  },
  activeIndicator: {
    backgroundColor: Theme.darkGray, // Active indicator color
    width: 50,
    height: 8,
    borderRadius: 10,
    gap: 15,
  },
});


// import {
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { Theme } from '../../constant/theme';
// import Header from '../../Component/Header';
// import CustomButton from '../../Component/CustomButton';
// import axios from 'axios';
// import { Base_Uri } from '../../constant/BaseUri';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { useIsFocused } from '@react-navigation/native';
// import CustomLoader from '../../Component/CustomLoader';

// const TutorVerificationProcess = ({ navigation }: any) => {
//   const [currentIndexJT, setCurrentIndexJT] = useState(0);
//   const data = [
//     {
//       id: '1',
//       title: 'Service Preferences',
//       status: 'Required',
//       screen: 'ServicePreference',
//     },
//     {
//       id: '2',
//       title: 'Bio Details',
//       status: 'Required',
//       screen: 'BioDetails'
//     },
//     {
//       id: '3',
//       title: 'Emergency Contact',
//       status: 'Required',
//       screen: 'EmergencyContact',
//     },
//     {
//       id: '4',
//       title: 'Education',
//       status: 'Required',
//       screen: 'EducationDetails',
//     },
//     {
//       id: '5',
//       title: 'Documents',
//       status: 'Required',
//       screen: 'VerificationDocumentsUpload',
//     },
//     {
//       id: '6',
//       title: 'Declaration',
//       status: 'Required',
//       screen: 'TutorVerificationDeclaration',
//     },
//   ];
//   const renderItem = ({ item }: any) => {
//     return (
//       <TouchableOpacity
//         activeOpacity={0.8}
//         onPress={() => navigation.navigate(item.screen)}
//         style={{
//           backgroundColor: item.status == false ? Theme.white : Theme.darkGray,
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           padding: 20,
//           borderRadius: 10,
//           height: 60,
//           alignItems: 'center',
//           marginVertical: 5,
//         }}>
//         <Text style={[styles.textType3, { color: item.status == false ? Theme.black : Theme.white }]}>{item.title}</Text>
//         {item.status == false ?
//           <Text
//             style={[
//               styles.textType3,
//               { color: Theme.IronsideGrey, fontFamily: 'Circular Std Book' },
//             ]}>
//             Required
//           </Text>
//           :
//           <AntDesign name='checkcircle' size={20} color={Theme.white} />
//         }
//       </TouchableOpacity>
//     )
//   };
//   const renderPagination = () => {
//     return (
//       <View style={styles.pagination}>
//         {verifySteps.map((item: any, index) => (
//           <View
//             key={index}
//             style={[
//               styles.indicator,
//               item.status == true ? styles.activeIndicator : null,
//             ]}
//           />
//         ))}
//       </View>
//     );
//   };
//   const [verifySteps, setVerifyStep] = useState([])
//   const focus = useIsFocused()
//   const [loading, setLoading] = useState(false)
//   const checkTutorVerification = async () => {
//     setLoading(true)
//     const login: any = await AsyncStorage.getItem('loginAuth');
//     let loginData = JSON.parse(login);
//     let { tutorID } = loginData;
//     let formData = new FormData();

//     formData.append('tutor_id', tutorID);
//     axios
//       .post(`${Base_Uri}api/tutor/checkTutorData`, formData)
//       .then(({ data }) => {
//         const { dataStatus } = data;
//         console.log("data hello worll", data);
//         setVerifyStep(dataStatus)
//         setLoading(false)
//       })
//       .catch(error => {
//         console.log("error", error);
//         setLoading(false)
//         // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
//       });
//   };
//   console.log("verifySteps", verifySteps);

//   useEffect(() => {
//     checkTutorVerification()
//   }, [focus])
//   const [isButtonEnabled, setIsButtonEnabled] = useState(false);

//   useEffect(() => {
//     const allTrue = verifySteps.every((item:any) => item.status);
//     setIsButtonEnabled(allTrue);
//   }, [verifySteps]);
//   return (
//     <View
//       style={{
//         backgroundColor: Theme.GhostWhite,
//         height: '100%',
//       }}>
//       <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
//         <Header
//           title={'Tutor Verification'}
//           backBtn
//           navigation={navigation}
//           needHelp
//         />
//         {verifySteps.length > 0  ?
//         <View style={{ paddingHorizontal: 25, marginBottom: 40 }}>
//           <View style={{ margin: 15 }}></View>
//           <Text style={styles.textType1}>You are Applying as a Tutor</Text>
//           <View style={{ margin: 5 }}></View>
//           <Text style={styles.textType3}>
//             Secure your tutoring opportunities by ensuring all your documents
//             are up-to-date.
//           </Text>
//           <View style={{ margin: 5 }}></View>
//           {renderPagination()}
//           <View style={{ margin: 10 }}></View>
//           <View>
//             <FlatList
//               data={verifySteps}
//               renderItem={renderItem}
//               keyExtractor={(items: any, index: number): any => index}
//               pagingEnabled
//             />

//           </View>
//           <View style={{ margin: 15 }}></View>
//           {/* <CustomButton btnTitle="Submit" backgroundColor={Theme.DustyGrey} onPress={() => navigation.navigate('VerificationSubmittedSuccess')} /> */}
//           <CustomButton
//         btnTitle="Submit"
//         backgroundColor={isButtonEnabled ? Theme.darkGray : Theme.DustyGrey} // Adjust the background color based on your theme
//         onPress={() => navigation.navigate('VerificationSubmittedSuccess')}
//         disabled={!isButtonEnabled}
//       />
//         </View>
//       : null}
//       </ScrollView>
//       <CustomLoader visible={loading}/>
//     </View>
//   );
// };

// export default TutorVerificationProcess;

// const styles = StyleSheet.create({
//   textType3: {
//     color: Theme.Dune,
//     fontWeight: '500',
//     fontSize: 16,
//     fontFamily: 'Circular Std Medium',
//     fontStyle: 'normal',
//   },
//   textType1: {
//     fontWeight: '500',
//     fontSize: 26,
//     color: Theme.Black,
//     fontFamily: 'Circular Std Medium',
//     lineHeight: 24,
//     fontStyle: 'normal',
//   },
//   pagination: {
//     flexDirection: 'row',
//     alignSelf: 'center',
//     marginTop: 10,
//     gap: 8
//   },
//   indicator: {
//     width: 50,
//     height: 8,
//     borderRadius: 4,
//     // marginHorizontal: 5,
//     backgroundColor: Theme.LightPattensBlue, // Inactive indicator color
//   },
//   activeIndicator: {
//     backgroundColor: Theme.darkGray, // Active indicator color
//     width: 50,
//     height: 8,
//     borderRadius: 10,
//     gap: 15,
//   }
// });
