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
  import React, { useContext, useEffect, useState } from 'react';
  import Header from '../../Component/Header';
  import { Theme } from '../../constant/theme';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  import { Base_Uri } from '../../constant/BaseUri';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import Entypo from 'react-native-vector-icons/Entypo';
  import Feather from 'react-native-vector-icons/Feather';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import TutorDetailsContext from '../../context/tutorDetailsContext';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import CustomButton from '../../Component/CustomButton';
  import Toast from 'react-native-toast-message';
  import SubjectIcon from '../../SVGs/SubjectIcon';
  import LevelIcon from '../../SVGs/LevelIcon';
  
  
  const JobTicketDetailOnly = ({ navigation , route}: any) => {
    const data = route.params;
  
    const [ticketDetail, setTicketDetail] = useState<any>(null);
    console.log("ticketDetail",ticketDetail?.age);
    
    const getTicketticketDetailByID = () => {
      axios
        .get(`${Base_Uri}api/ticketAPI/${data}`)
        .then(({ data }) => {
          setTicketDetail(data.ticket);
        })
        .catch(error => {
          console.error('Error fetching ticket detail:', error);
        });
    };
  
    useEffect(() => {
      getTicketticketDetailByID();
    }, []);
  
    const [openDetailItem, setopenDetailItem] = useState({
      comment: '',
    });
  
    const tutor = useContext(TutorDetailsContext);
    let { tutorDetails, updateTutorDetails } = tutor;
    console.log('tutorDetails', tutorDetails);
  
    const [loading, setLoading] = useState(false);
  
    const sendOpenDetailticketDetail = async () => {
      setLoading(true);
      let tutorticketDetail: any = await AsyncStorage.getItem('loginAuth');
  
      tutorticketDetail = await JSON.parse(tutorticketDetail);
  
      let subjectId = ticketDetail?.subject_id;
      // let ticket_id = ticketDetail?.ticket_id
      let ticketID = ticketDetail?.ticketID;
      // let id = ticketDetail?.id
      let tutor_id = tutorticketDetail?.tutorID;
      let comment = openDetailItem.comment ? openDetailItem?.comment : null;
      // console.log('idddddddddddddd',ticketDetail.id)
      console.log(subjectId, 'subjectId');
      console.log(ticketID, 'ticketID');
      console.log(tutor_id, 'tutor_id');
      console.log(comment, 'comment');
  
  
      axios
        .get(
          `${Base_Uri}offerSendByTutor/${subjectId}/${tutor_id}/${ticketID}/${comment}`,
        )
        .then(({ ticketDetail }:any) => {
          if (ticketDetail?.result?.status == 'pending') {
            setLoading(false);
            // ToastAndroid.show(
            //   'You have successfully applied for this ticket',
            //   ToastAndroid.SHORT,
            // );
            Toast.show({
              type: 'info',
              // text1: 'Request timeout:',
              text2:  `You have successfully applied for this ticket`,
              position:'bottom'
            });
            navigation.navigate('Job Ticket', ticketID);
          } else {
            console.log(ticketDetail, 'ticketDetailaa');
            // ToastAndroid.show(ticketDetail?.result, ToastAndroid.SHORT);
            Toast.show({
              type: 'info',
              // text1: 'Request timeout:',
              text2:  `${ticketDetail?.result}`,
              position:'bottom'
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
        <Header title={ticketDetail?.jtuid} backBtn navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <View style={{ paddingHorizontal: 25 }}>
            <View
              style={{
                backgroundColor: Theme.darkGray,
                padding: 15,
                marginTop: 10,
                borderRadius: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={[styles.textType3, { color: 'white' }]}>
                  {ticketDetail?.jtuid}
                </Text>
                <Text
                  style={[styles.textType1, { lineHeight: 30, color: 'white' }]}>
                  RM {ticketDetail[0]?.price}
                </Text>
                <View
                  style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                  <Feather name="map-pin" size={18} color={'#fff'} />
                  <Text style={[styles.textType3, { color: 'white' }]}>
                    {ticketDetail?.city}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center', }}>
              <View style={{
                  backgroundColor: '#000',
                  paddingVertical: 5,
                  paddingHorizontal: 30,
                  borderRadius: 30,
                }}>
                  <Text
                    style={[
                      styles.textType3,
                      {
                        color: '#fff',
                        textTransform: 'capitalize',
                      },
                    ]}>
                    {ticketDetail?.mode}
                  </Text>
                </View>
  
              </View>
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text style={styles.textType1}>Details</Text>
  
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
                    paddingBottom: 15,
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
                    <Text style={styles.textType3}>Student Name</Text>
                  </View>
                  <Text
                    style={[
                      styles.textType1,
                      { fontSize: 18, textTransform: 'capitalize', },
                    ]}>
                    {ticketDetail?.studentName?.length > 14 ? `${ticketDetail?.studentName?.slice(0, 14)}..` : ticketDetail?.studentName}
                  </Text>
                </View>
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
                    <FontAwesome
                      name="graduation-cap"
                      size={18}
                      color={Theme.darkGray}
                    />
                    <Text style={styles.textType3}>Student Detail</Text>
                  </View>
                  <Text style={[styles.textType1, { fontSize: 18 }]}>
                    {ticketDetail?.studentGender} ({ticketDetail?.student_age} y/o)
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <Feather name="hash" size={18} color={Theme.darkGray} />
                    <Text style={styles.textType3}>No. of Sessions</Text>
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
                        },
                      ]}>
                      {ticketDetail?.classFrequency}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <Entypo name="time-slot" size={18} color={Theme.darkGray} />
                    <Text style={styles.textType3}>Class Duration(Hrs)</Text>
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
                        },
                      ]}>
                      {ticketDetail?.quantity}
                    </Text>
                  </View>
                </View>
              </View>
  
              <View
                style={{
                  backgroundColor: Theme.white,
                  paddingHorizontal: 25,
                  paddingVertical: 15,
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
                      gap: 12,
                      paddingBottom: 15,
                    }}>
                    {/* <FontAwesome name="level-up" size={22} color={Theme.darkGray} /> */}
                    <LevelIcon/>
                    <Text style={styles.textType3}>Level</Text>
                  </View>
                  <Text style={[styles.textType1, { fontSize: 18 }]}>
                    {ticketDetail?.categoryName}
                  </Text>
                </View>
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
                      paddingBottom: 15,
                    }}>
                    <Ionicons name="recording-sharp" size={18} color={Theme.darkGray} />
                    <Text style={styles.textType3}>Subscription</Text>
                  </View>
                  <Text style={[styles.textType1, { fontSize: 18 }]}>
                    {ticketDetail?.subscription}
                  </Text>
                </View>
  
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
                    <SubjectIcon/>
                    <Text style={styles.textType3}>Subject</Text>
                  </View>
                  <Text style={[styles.textType1, { fontSize: 18 }]}>
                    {ticketDetail?.subject_name}
                  </Text>
                </View>
  
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingBottom: 15,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <FontAwesome name="user-o" size={18} color={Theme.darkGray} />
                    <Text style={styles.textType3}>Pref. Tutor</Text>
                  </View>
                  <Text
                    style={[
                      styles.textType1,
                      { fontSize: 18, textTransform: 'capitalize' },
                    ]}>
                    {ticketDetail?.tutorPereference}
                  </Text>
                </View>
  
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    paddingTop: 15,
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
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
                        {ticketDetail?.classDay}
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
                        {ticketDetail?.classTime}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
  
              {/*Adress */}
  
              {ticketDetail?.specialRequest && (
                <View style={{ marginVertical: 20 }}>
                  <Text style={styles.textType1}>Special Need</Text>
                  <View
                    style={{
                      backgroundColor: Theme.white,
                      paddingHorizontal: 25,
                      paddingVertical: 20,
                      borderRadius: 20,
                      marginVertical: 5,
                    }}>
                    <Text
                      style={[
                        styles.textType3,
                        { fontFamily: 'Circular Std Book' },
                      ]}>
                      {ticketDetail.specialRequest}
                    </Text>
                  </View>
                </View>
              )}
              {/* Special Need */}
  
              {tutorDetails?.status?.toLowerCase() == 'verified' &&
                ticketDetail?.mode?.toLowerCase() == 'physical' &&
                ticketDetail?.studentAddress && (
                  <View style={{ marginVertical: 5 }}>
                    <Text style={styles.textType1}>Student Address</Text>
                    <View
                      style={{
                        backgroundColor: Theme.white,
                        paddingHorizontal: 25,
                        paddingVertical: 20,
                        borderRadius: 20,
                        marginVertical: 5,
                      }}>
                      <Text
                        style={[
                          styles.textType3,
                          { fontFamily: 'Circular Std Book' },
                        ]}>
                        {ticketDetail?.studentAddress}
                      </Text>
                    </View>
                  </View>
                )}
              {/* Avaiable student */}
              {ticketDetail?.jobTicketExtraStudents?.length > 0 && (
                <View style={{ marginVertical: 15 }}>
                  <Text style={styles.textType1}>Extra Students</Text>
  
                  {ticketDetail?.jobTicketExtraStudents?.map((e: any, i: number) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: Theme.white,
                        paddingHorizontal: 25,
                        paddingVertical: 20,
                        borderRadius: 20,
                        marginVertical: 5,
                      }}>
                      <Text style={styles.textType3}>
                        Student Name : {e?.student_name}
                      </Text>
                      <Text
                        // style={{
                        //   color: Theme.black,
                        //   fontSize: 14,
                        //   fontWeight: '400',
                        //   marginTop: 5,
                        //   fontFamily: 'Circular Std Book',
                        // }}
                        style={styles.textType3}>
                        Age : {e?.student_age}
                      </Text>
                      <Text
                        // style={{
                        //   color: Theme.black,
                        //   fontSize: 14,
                        //   fontWeight: '400',
                        //   marginTop: 5,
                        //   fontFamily: 'Circular Std Book',
                        // }}
                        style={styles.textType3}>
                        Gender : {e?.student_gender}
                      </Text>
                      <Text
                        // style={{
                        //   color: Theme.black,
                        //   fontSize: 14,
                        //   fontWeight: '400',
                        //   marginTop: 5,
                        //   fontFamily: 'Circular Std Book',
                        // }}
                        style={styles.textType3}>
                        Birth Year : {e?.year_of_birth}
                      </Text>
                      <Text
                        // style={{
                        //   color: Theme.black,
                        //   fontSize: 14,
                        //   fontWeight: '400',
                        //   marginTop: 5,
                        //   fontFamily: 'Circular Std Book',
                        // }}
                        style={styles.textType3}>
                        Special Need : {e?.special_need}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              {/* Comment */}
              <View style={{ marginBottom: 20, marginTop: 10 }}>
                <Text style={styles.textType1}>Comment</Text>
                <View
                  style={[
                    styles.textAreaContainer,
                    {
                      // borderWidth: 1,
                      marginTop: 5,
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
              <CustomButton btnTitle={'Apply'} onPress={sendOpenDetailticketDetail} />
            </View>
          </View>
        </ScrollView>
  
      </View>
    );
  };
  
  export default JobTicketDetailOnly;
  
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
      fontWeight: '500',
      fontSize: 24,
      color: Theme.Dune,
      fontFamily: 'Circular Std Medium',
      lineHeight: 24,
      fontStyle: 'normal',
    },
    textType3: {
      color: Theme.Dune,
      fontSize: 16,
      fontFamily: 'Circular Std Medium',
    },
  });
  