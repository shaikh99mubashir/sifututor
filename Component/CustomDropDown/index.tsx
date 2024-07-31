import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Theme } from '../../constant/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
const CustomDropDown = (props: any) => {
  let { ddTitle, categoryData, dataShow, searchData, searchFunc, subject, search, headingStyle, categoryShow, dropdownPlace, dropdownContainerStyle, setSelectedSubject, selectedSubject,ddTextStyle,searchCategoryData } = props


  const [selectedServicedata, setSelectedServicedata]: any = useState({});
  const [serviceDD, setServiceDD] = useState(false);
  const SelectedServices = (item: any) => {

    setSelectedSubject(item);

    setServiceDD(!serviceDD);
  };

  const filterSearchData = (text: string) => {

    if (text.length > 0) {
      searchFunc(text, search)
    }


  }

  return (
    <View>
      <View style={{ borderRadius: 12,
         overflow: 'hidden',
          marginVertical: 5,
           }}>
        {ddTitle &&
          <Text
            style={{
              fontFamily: 'Circular Std Medium',
              color: Theme.gray,
              fontSize: 16,
              marginVertical: 5,
              textTransform:'capitalize',
              marginHorizontal: 5,
              ...headingStyle

            }}>
            {ddTitle}
          </Text>
        }
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setServiceDD(!serviceDD)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderWidth: 0,
            backgroundColor: Theme.white,
            borderRadius:15,
            height:60,
            // borderTopLeftRadius: 10,
            // borderTopRightRadius: 10,
            // borderBottomWidth: serviceDD ? 0 : 1,
            // borderBottomLeftRadius: serviceDD ? 1 : 5,
            // borderBottomRightRadius: serviceDD ? 1 : 5,
            borderColor: Theme.gray,
            alignItems: 'center',
            // elevation:2,
            ...dropdownContainerStyle
          }}>
          {selectedServicedata &&
            Object.keys(selectedServicedata).length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 16,
                  textTransform:'capitalize',
                }}>
                {selectedServicedata.complain_name &&
                  selectedServicedata.complain_name > 10
                  ? selectedServicedata.complain_name.slice(0, 10)
                  : selectedServicedata.complain_name}
              </Text>
              {serviceDD ? (
                <Image source={require('../../Assets/Images/up.png')} style={{ width: 20, height: 20 }} />
              ) : (
                <Image source={require('../../Assets/Images/down.png')} style={{ width: 20, height: 20 }} />
              )}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 16,
                  textTransform:'capitalize',
                }}>
                {selectedSubject ? selectedSubject?.subject?.length > 25 ?
                  `${selectedSubject?.subject?.slice(0, 25)}...` : selectedSubject?.subject : dropdownPlace ?? ddTitle}
              </Text>
              {serviceDD ? (
                // <Image source={require('../../Assets/Images/up.png')} style={{ width: 15, height: 20 }} resizeMode='contain' />
                <AntDesign name='up' size={20} color={'black'}/>
              ) : (
                // <Image source={require('../../Assets/Images/down.png')} style={{ width: 20, height: 20 }} />
                <AntDesign name='down' size={20} color={'black'}/>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
      {categoryData &&
        <View
          style={{
            borderBottomEndRadius: 5,
            borderBottomStartRadius: 5,
            borderWidth: !serviceDD ? 0 : 1,
            borderTopWidth: !serviceDD ? 0 : 1,
            borderColor: Theme.gray,
            top: -14,
          }}>
          <ScrollView style={{ maxHeight: 100 }} nestedScrollEnabled={true}>
            {serviceDD == true &&
              Array.from(
                new Set(categoryData && categoryData.map((item: any) => item.complain_name)),
              ).map((e: any, i: number) => {

                return (
                  <TouchableOpacity
                    onPress={() =>
                      SelectedServices(
                        categoryData.find(
                          (item: any) => item.complain_name === e,
                        ),
                      )
                    }
                    key={i}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      marginVertical: 5,
                      gap: 10,
                    }}>
                    <Text
                      style={{
                        color: Theme.gray,
                        fontFamily: 'Circular Std Medium',
                        fontSize: 16,
                        textTransform:'capitalize',
                      }}>
                      {e}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
      }
      {subject &&
        <View
          style={{
            // borderBottomEndRadius: 5,
            // borderBottomStartRadius: 5,
            borderRadius:15,
            // borderWidth: !serviceDD ? 0 : 1,
            // borderTopWidth: !serviceDD ? 0 : 1,
            borderColor: Theme.gray,
            // top: 10,
            marginVertical:5,
            backgroundColor:Theme.white,
            paddingVertical:!serviceDD ? 0 : 15,
            paddingHorizontal:10,
            // elevation:3
          }}>
          <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled={true}>

            {serviceDD == true &&
              <View>
                {search && <TextInput onChangeText={(e) => filterSearchData(e)} style={{
                  paddingHorizontal: 10,
                  marginVertical: 0,
                  color: 'black',
                  backgroundColor: Theme.white,
                  // backgroundColor: "white",
                  borderBottomWidth: 1,
                  borderBottomColor:'lightgrey',
                  gap: 0,
                  height: 38,
                  fontFamily: 'Circular Std Medium',
                  borderTopRightRadius:10,
                  borderTopLeftRadius:10,
                }}
                  placeholder={'Search'}
                  placeholderTextColor={Theme.IronsideGrey}

                />}
                {searchData && searchData.length > 0 ? Array.from(
                  new Set(searchData && searchData.map((item: any) => item?.subject)),
                ).map((e: any, i: number) => {

                  return (
                    <TouchableOpacity
                      onPress={() =>
                        SelectedServices(
                          subject.find(
                            (item: any) => `${item?.subject}` === e,
                          ),
                        )
                      }
                      key={i}
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        marginVertical: 5,
                        gap: 10,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Circular Std Medium',
                          fontSize: 16,
                          textTransform:'capitalize'
                        }}>
                        {e ?? selectedSubject}
                      </Text>
                    </TouchableOpacity>
                  );

                }).filter(Boolean)
                  :
                  Array.from(
                    new Set(subject && subject.map((item: any) => item?.subject)),
                  ).map((e: any, i: number) => {
                    if (i < 5) {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            SelectedServices(
                              subject.find(
                                (item: any) => `${item?.subject}` === e,
                              ),
                            )
                          }
                          key={i}
                          style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            marginVertical: 5,
                            gap: 10,
                          }}>
                          <Text
                            style={{
                              color: Theme.black,
                              fontFamily: 'Circular Std Medium',
                              fontSize: 16,
                              textTransform:ddTextStyle ? ddTextStyle : 'capitalize'
                            }}>
                            {e ?? selectedSubject}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  }).filter(Boolean)
                }
              </View>
            }
          </ScrollView>
        </View>
      }
    </View>
 
  )
}

export default CustomDropDown

const styles = StyleSheet.create({})