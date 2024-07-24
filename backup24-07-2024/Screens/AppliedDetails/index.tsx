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
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TutorDetailsContext from '../../context/tutorDetailsContext';

const AppliedDetails = ({ route, navigation }: any) => {
  const data = route.params;
  console.log('data', data);

  const [openDetailItem, setopenDetailItem] = useState({
    comment: '',
  });

  const tutor = useContext(TutorDetailsContext);
  let { tutorDetails, updateTutorDetails } = tutor;
  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <View style={{margin:20}}></View>
      <Header title={data?.jtuid} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
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
                {data?.jtuid}
              </Text>
              <Text
                style={[styles.textType1, { lineHeight: 30, color: 'white' }]}>
                RM {data?.price}
              </Text>
              <View
                style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <Feather
                  name="map-pin"
                  size={18}
                  color={'#fff'}
                />
                <Text style={[styles.textType3, { color: 'white' }]}>
                  {data?.city}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{backgroundColor: '#000',
                      paddingVertical: 5,
                      paddingHorizontal: 30,
                      borderRadius: 30,}}>
                
              <Text
                style={[
                  styles.textType3,
                  {
                    color: '#fff',
                    textTransform:'capitalize'
                  },
                ]}>
                {data?.offer_status}
              </Text>
                  </View>
            </View>
          </View>
          <View style={{ marginVertical: 20 }}>
            <Text style={styles.textType1}>Details</Text>

            <View
              style={{
                backgroundColor: Theme.liteBlue,
                padding: 15,
                marginTop: 10,
                borderRadius: 12,
              }}>
                <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom:15,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 10,
                
                  }}>
                  <FontAwesome
                    name="user-o"
                    size={18}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Student Name</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18,textTransform:'capitalize' }]}>
                  {data?.studentName}
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
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Student Detail</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                  {data?.studentGender},({data?.student_age} y/o)
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
                  <Feather
                    name="hash"
                    size={18}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>No. of Sessions</Text>
                </View>
                <View style={{ backgroundColor: '#298CFF33',
                      paddingVertical: 2,
                      // paddingHorizontal: 10,
                      borderRadius: 50,
                      
                      width:30,
                      height:30,}}>

                
                <Text
                  style={[
                    styles.textType1,
                    {
                      color: '#003E9C',
                      textAlign:'center',
                      fontSize: 18,
                    },
                  ]}>
                  {data?.classFrequency}
                </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                backgroundColor: Theme.liteBlue,
                padding: 15,
                marginTop: 10,
                borderRadius: 12,
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
                    paddingBottom:15,
                  }}>
                  <FontAwesome
                    name="level-up"
                    size={22}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Level</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                {data?.categoryName}
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
                  <AntDesign
                    name="copy1"
                    size={18}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Subject</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                  {data?.subject_name}
                </Text>
              </View>
             
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  paddingBottom:15
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 10,
                  }}>
                  <FontAwesome
                    name="user-o"
                    size={18}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Pref. Tutor</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 ,textTransform:'capitalize'}]}>
                  {data?.tutorPereference}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#eee' }}>
                <View style={{ backgroundColor: "#E6F2FF", paddingVertical: 10, borderRadius: 10 }}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, paddingHorizontal: 10 }}>
                    <AntDesign
                      name="calendar"
                      size={20}
                      color={'#298CFF'}
                    />
                    <Text style={[styles.textType3, { color: '#298CFF' }]}>{data?.classDay}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: "#E6F2FF", paddingVertical: 10, borderRadius: 10, paddingHorizontal: 10 }}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}>
                    <AntDesign
                      name="clockcircleo"
                      size={20}
                      color={'#298CFF'}
                    />
                    <Text style={[styles.textType3, { color: '#298CFF' }]}>{data?.classTime}</Text>
                  </View>
                </View>

              </View>


            </View>

           
            {/*Adress */}

            {data.specialRequest &&
              <View style={{ marginVertical: 20 }}>
                <Text
                  style={styles.textType1}>
                  Special Need
                </Text>
                <View
                  style={{
                    backgroundColor: Theme.liteBlue,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={[styles.textType3,{ fontFamily: 'Circular Std Book',}]}>
                    {data.specialRequest}
                  </Text>
                </View>
              </View>
            }
            {/* Special Need */}

            {tutorDetails?.status?.toLowerCase() == 'verified' && data?.mode?.toLowerCase() == 'physical' && data?.studentAddress &&
              <View style={{ marginVertical: 5,}}>
                <Text
                  style={styles.textType1}>
                  Student Address
                </Text>
                <View
                  style={{
                    backgroundColor: Theme.liteBlue,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={[styles.textType3,{ fontFamily: 'Circular Std Book',}]}>
                    {data.studentAddress}
                  </Text>
                </View>
              </View>
            }
            {/* Avaiable student */}
            {data?.jobTicketExtraStudents && data?.jobTicketExtraStudents.length > 0 &&
              <View style={{ marginVertical: 15 }}>
                <Text
                  style={styles.textType1}>
                  Extra Students
                </Text>

                {data?.jobTicketExtraStudents?.map((e: any, i: number) => (
                  <View
                  key={i}
                    style={{
                      backgroundColor: Theme.liteBlue,
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      borderRadius: 10,
                      marginVertical: 5,
                    }}>
                    <Text
                       style={styles.textType3}>
                      Student Name : {e?.student_name}
                    </Text>
                    <Text
                      style={styles.textType3}
                      >
                      Age : {e?.student_age}
                    </Text>
                    <Text
                      style={styles.textType3}
                      >
                      Gender : {e?.student_gender}
                    </Text>
                    <Text
                      style={styles.textType3}
                      >
                      Birth Year : {e?.year_of_birth}
                    </Text>
                    <Text
                      style={styles.textType3}
                      >
                      Special Need : {e?.special_need}
                    </Text>
                  </View>
                ))}
              </View>
            }
           
          </View>
        </View>
      </ScrollView>
    
    </View>
  );
};

export default AppliedDetails;

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
