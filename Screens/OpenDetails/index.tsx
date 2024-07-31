import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../Component/CustomButton';
import Toast from 'react-native-toast-message';
import SubjectIcon from '../../SVGs/SubjectIcon';
import LevelIcon from '../../SVGs/LevelIcon';
import StudentDetail from '../../SVGs/StudentDetail';
import PrefTutor from '../../SVGs/PrefTutor';
import StudentIcon from '../../SVGs/StudentIcon';
import BeforeTime from '../../SVGs/BeforeTime';

const OpenDetails = ({ route, navigation }: any) => {
  const data = route.params;
  console.log('data', data);

  const [openDetailItem, setopenDetailItem] = useState({
    comment: '',
  });

  const tutor = useContext(TutorDetailsContext);
  let { tutorDetails, updateTutorDetails } = tutor;
  console.log('tutorDetails', tutorDetails);

  const [loading, setLoading] = useState(false);

  const sendOpenDetailData = async () => {
    setLoading(true);
    let tutorData: any = await AsyncStorage.getItem('loginAuth');

    tutorData = await JSON.parse(tutorData);

    let subjectId = data?.subject_id;
    // let ticket_id = data?.ticket_id
    let ticketID = data?.ticketID;
    // let id = data?.id
    let tutor_id = tutorData?.tutorID;
    let comment = openDetailItem.comment ? openDetailItem?.comment : null;
    // console.log('idddddddddddddd',data.id)
    console.log(subjectId, 'subjectId');
    console.log(ticketID, 'ticketID');
    console.log(tutor_id, 'tutor_id');
    console.log(comment, 'comment');


    axios
      .get(
        `${Base_Uri}offerSendByTutor/${subjectId}/${tutor_id}/${ticketID}/${comment}`,
      )
      .then(({ data }) => {
        if (data?.result?.status == 'pending') {
          setLoading(false);
          // ToastAndroid.show(
          //   'You have successfully applied for this ticket',
          //   ToastAndroid.SHORT,
          // );
          Toast.show({
            type: 'info',
            // text1: 'Request timeout:',
            text2: `You have successfully applied for this ticket`,
            position: 'bottom'
          });
          navigation.navigate('Job Ticket', ticketID);
        } else {
          console.log(data, 'dataaa');
          // ToastAndroid.show(data?.result, ToastAndroid.SHORT);
          Toast.show({
            type: 'info',
            // text1: 'Request timeout:',
            text2: `${data?.result}`,
            position: 'bottom'
          });
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error, 'error');
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  return (
    <View style={{ backgroundColor: Theme.GhostWhite, height: '100%' }}>
      <Header title={data?.jtuid} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 25 }}>
          <View
            style={{
              backgroundColor: Theme.darkGray,
              paddingHorizontal: 25,
              paddingTop: 20,
              paddingBottom:12,
              marginTop: 20,
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={[styles.textType3, { color: 'white', fontFamily: 'Circular Std Bold', fontWeight: 700, lineHeight: 20 }]}>
                {data?.jtuid}
              </Text>
              <Text
                style={[styles.textType1, { lineHeight: 30, color: 'white', }]}>
                RM {data?.price}
              </Text>
              <View style={{ margin: 1 }} />
              <View
                style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <Feather name="map-pin" size={16} color={'#fff'} />
                <Text style={[styles.textType3, { color: 'white' }]}>
                  {data?.city}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
              <View style={{
                backgroundColor: '#000',
                // paddingVertical: 5,
                // paddingHorizontal: 30,
                borderRadius: 30,
                height: 36,
                width: 110,
                justifyContent: 'center',
              }}>
                <Text
                  style={[
                    styles.textType3,
                    {
                      color: '#fff',
                      textTransform: 'capitalize',
                      textAlign: 'center',
                      fontFamily: 'Circular Std Bold',
                      fontWeight: 500
                    },
                  ]}>
                  {data?.mode}
                </Text>
              </View>

            </View>
          </View>
          <View style={{ marginVertical: 0 }}>
            <View style={{ margin: 15 }}></View>
            <Text style={[styles.textType1, { lineHeight: 24 }]}>Details</Text>
            <View
              style={{
                backgroundColor: Theme.white,
                paddingHorizontal: 25,
                paddingVertical: 20,
                marginTop: 10,
                borderRadius: 20,
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%'
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                  }}>
                  {/* <FontAwesome name="user-o" size={18} color={Theme.darkGray} /> */}
                  <View style={{right:2}}>
                  <StudentIcon/>
                  </View>
                  <Text style={[styles.textType3, { color: Theme.IronsideGrey, fontFamily: 'Circular Std Book' }]}>Student Name</Text>
                </View>
                <Text
                  style={[
                    styles.textType1,
                    { fontSize: 18, textTransform: 'capitalize', },
                  ]}>
                  {data?.studentName.length > 14 ? `${data?.studentName.slice(0, 14)}..` : data?.studentName}
                </Text>
              </View>
              <View style={{ margin: 7 }}></View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 4,
                  }}>
                  <View style={{ right: 3 }}>
                    <StudentDetail />
                  </View>
                  <Text style={[styles.textType3, { color: Theme.IronsideGrey, }]}>Student Detail</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18, }]}>
                  {data?.studentGender} ({data?.student_age} y/o)
                </Text>
              </View>
              <View style={{ margin: 7 }}></View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 9,
                  }}>
                  <Feather name="hash" size={18} color={Theme.darkGray} />
                  <Text style={styles.textType3}>No. of Sessions</Text>
                </View>

                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#298CFF33',
                    borderRadius: 50,
                  }}>
                  <Text
                    style={[
                      styles.textType1,
                      {
                        color: '#003E9C',
                        textAlign: 'center',
                        fontSize: 18,
                        paddingTop: 5
                      },
                    ]}>
                    {data?.classFrequency}
                  </Text>
                </View>
              </View>
              <View style={{ margin: 4 }}></View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 9,
                  }}>
                  <Entypo name="time-slot" size={18} color={Theme.darkGray} />
                  <Text style={styles.textType3}>Class Duration hour(s)</Text>
                </View>

                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#298CFF33',
                    paddingVertical: 2,
                    borderRadius: 50,
                  }}>
                  <Text
                    style={[
                      styles.textType1,
                      styles.textType1,
                      {
                        color: '#003E9C',
                        textAlign: 'center',
                        fontSize: 18,
                        paddingTop: 4
                      },
                    ]}>
                    {data?.quantity}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ margin: 3 }}></View>
            <View
              style={{
                backgroundColor: Theme.white,
                paddingHorizontal: 25,
                paddingVertical: 20,
                marginTop: 10,
                borderRadius: 20,
              }}>
                
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                  }}>
                  <LevelIcon />
                  <Text style={styles.textType3}>Level</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                  {data?.categoryName}
                </Text>
              </View>
              <View style={{ margin: 5 }}></View>

              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 9,
                  }}>
                  <SubjectIcon />
                  <Text style={styles.textType3}>Subject</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                  {data?.subject_name}
                </Text>
              </View>
              <View style={{ margin: 5 }}></View>
              
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 12,
                  }}>
                  {/* <FontAwesome name="user-o" size={18} color={Theme.darkGray} /> */}
                  <View style={{left:2}}>
                  <PrefTutor/>
                  </View>
                  <Text style={styles.textType3}>Pref. Tutor</Text>
                </View>
                <Text
                  style={[
                    styles.textType1,
                    { fontSize: 18, textTransform: 'capitalize' },
                  ]}>
                  {data?.tutorPereference}
                </Text>
              </View>
              <View style={{ margin: 10 }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  paddingTop: 18,
                  borderTopWidth: 1,
                  borderTopColor: '#eee',
                  flexWrap: 'wrap'
                }}>
                <View
                  style={{
                    backgroundColor: '#E6F2FF',
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                      paddingHorizontal: 10,
                    }}>
                    <AntDesign name="calendar" size={20} color={Theme.darkGray} />
                    <Text style={[styles.textType3, { color: Theme.darkGray }]}>
                      {data?.classDay}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#E6F2FF',
                    paddingVertical: 10,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <AntDesign
                      name="clockcircleo"
                      size={20}
                      color={Theme.darkGray}
                    />
                    <Text style={[styles.textType3, { color: Theme.darkGray }]}>
                      {data?.classTime}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#E6F2FF',
                    paddingVertical: 10,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <Ionicons name="recording-sharp" size={20} color={Theme.darkGray} />
                    <Text style={[styles.textType3, { color: Theme.darkGray }]}>
                      {data?.subscription?.toLowerCase() == 'longterm' ? "Long-Term" : 'Short-Term'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ margin: 10 }}></View>
            <Text style={[styles.textType1, { lineHeight: 24 }]}>Payment Breakdown</Text>
            <View
              style={{
                backgroundColor: Theme.white,
                paddingHorizontal: 25,
                paddingVertical: 15,
                marginTop: 12,
                borderRadius: 20,
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 7,

                  }}>
                  <MaterialCommunityIcons name="clock-time-eight-outline" size={20} color={Theme.darkGray} />
                  {/* <BeforeTime/> */}
                  <Text style={styles.textType3}>Before 9 Hours</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                  RM {data?.per_class_commission_before_eight_hours}
                </Text>
              </View>
              <View style={{ margin: 5 }}></View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 6,
                  }}>
                  <MaterialCommunityIcons name="av-timer" size={22} color={Theme.darkGray} />
                  <Text style={styles.textType3}>After 9 Hours</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                  RM {data?.per_class_commission_after_eight_hours}
                </Text>
              </View>
            </View>

            {/*Adress */}

            {data.specialRequest && (
              <>
                <View style={{ margin: 12 }}></View>
                <View style={{ marginVertical: 0 }}>
                  <Text style={[styles.textType1, { lineHeight: 24 }]}>Special Need</Text>
                  <View
                    style={{
                      backgroundColor: Theme.white,
                      paddingHorizontal: 25,
                      paddingVertical: 20,
                      borderRadius: 20,
                      marginVertical: 5,
                      marginTop: 12,
                    }}>
                    <Text
                      style={[
                        styles.textType3,
                        { fontFamily: 'Circular Std Book', lineHeight: 23 },
                      ]}>
                      {data.specialRequest}
                    </Text>
                  </View>
                </View>
              </>
            )}
            {/* Special Need */}

            {tutorDetails?.status?.toLowerCase() == 'verified' &&
              data?.mode?.toLowerCase() == 'physical' &&
              data?.studentAddress && (
                <>
                  <View style={{ margin: 10 }}></View>
                  <View style={{ marginVertical: 0 }}>
                    <Text style={[styles.textType1, { lineHeight: 24 }]}>Student Address</Text>
                    <View
                      style={{
                        backgroundColor: Theme.white,
                        paddingHorizontal: 25,
                        paddingVertical: 20,
                        borderRadius: 20,
                        marginVertical: 5,
                        marginTop: 12,
                      }}>
                      <Text
                        style={[
                          styles.textType3,
                          { fontFamily: 'Circular Std Book' },
                        ]}>
                        {data.studentAddress}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            {/* Avaiable student */}
            {data?.jobTicketExtraStudents.length > 0 && (
              <>
                <View style={{ margin: 10 }}></View>
                <View style={{ marginVertical: 0 }}>
                  <Text style={[styles.textType1, { lineHeight: 24 }]}>Extra Students</Text>

                  {data?.jobTicketExtraStudents?.map((e: any, i: number) => {

                    return (
                      <View
                        key={i}
                        style={{
                          backgroundColor: Theme.white,
                          paddingHorizontal: 25,
                          paddingVertical: 20,
                          borderRadius: 20,
                          marginVertical: 5,
                          marginTop: 12,
                        }}>

                        <View
                          style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%'
                          }}>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row',
                              gap: 10,
                            }}>
                            <FontAwesome name="user-o" size={18} color={Theme.darkGray} />
                            <Text style={[styles.textType3, { color: Theme.IronsideGrey, fontFamily: 'Circular Std Book' }]}>Student Name</Text>
                          </View>
                          <Text
                            style={[
                              styles.textType1,
                              { fontSize: 18, textTransform: 'capitalize', },
                            ]}>
                            {e?.student_name.length > 14 ? `${e?.student_name.slice(0, 14)}..` : e?.student_name}
                          </Text>
                        </View>
                        <View style={{ margin: 7 }}></View>
                        <View
                          style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row',
                              gap: 4,
                            }}>
                            <View style={{ right: 3 }}>
                              <StudentDetail />
                            </View>
                            <Text style={[styles.textType3, { color: Theme.IronsideGrey, }]}>Student Detail</Text>
                          </View>
                          <Text style={[styles.textType1, { fontSize: 18, }]}>
                            {e?.student_gender} ({e?.student_age} y/o)
                          </Text>
                        </View>
                        <View style={{ margin: 7 }}></View>
                        <View
                          style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row',
                              gap: 10,
                            }}>
                            <Feather name="hash" size={18} color={Theme.darkGray} />
                            <Text style={styles.textType3}>Special Need</Text>
                          </View>
                          <Text style={[styles.textType1, { fontSize: 18, }]}>
                            {e?.special_need}
                          </Text>

                        </View>

                      </View>
                    )
                  }
                  )}
                </View>
              </>
            )}


            {/* Comment */}
            <View style={{ margin: 10 }}></View>
            <View style={{ marginBottom: 23, marginTop: 0 }}>
              <Text style={[styles.textType1, { lineHeight: 24 }]}>Comment</Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    // borderWidth: 1,
                    marginTop: 12,
                    borderRadius: 20,
                    marginHorizontal: 2,

                  },
                ]}>
                <TextInput
                  placeholder="Enter Your Comment For The First Time, Let us Know your Teaching Experience"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e =>
                    setopenDetailItem({ ...openDetailItem, comment: e })
                  }
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: Theme.white,
                      paddingHorizontal: 20,
                      paddingVertical: 20,
                      color: Theme.black,
                      fontFamily: 'Circular Std Book',
                      borderRadius: 20,
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                />
              </View>
            </View>

            {/* Submit Button */}
            <CustomButton btnTitle={'Apply'} onPress={sendOpenDetailData} />
            <View style={{ margin: 10 }}></View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OpenDetails;

const styles = StyleSheet.create({
  textAreaContainer: {
    // borderColor: COLORS.grey20,
    // borderWidth: 1,
    // padding: 5,
    borderRadius: 10,
    fontFamily: 'Circular Std Medium',
  },
  textArea: {
    borderRadius: 10,
    height: 100,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontFamily: 'Circular Std Medium',
  },

  textType1: {
    fontWeight: 500,
    fontSize: 24,
    color: Theme.Dune,
    fontFamily: 'Circular Std Medium',
    lineHeight: 20,
    fontStyle: 'normal',
  },
  textType3: {
    color: Theme.IronsideGrey,
    fontSize: 16,
    fontFamily: 'Circular Std Book',
    lineHeight: 22,
    fontWeight: 400,
  },
});
