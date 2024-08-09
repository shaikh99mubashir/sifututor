import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Theme } from '../../constant/theme';
import Icon from 'react-native-vector-icons/AntDesign';
import { getFocusedRouteNameFromRoute, useFocusEffect } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NeedHelp from '../../SVGs/NeedHelp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterIcon from '../../SVGs/FilterIcon';
import FilterIconTick from '../../SVGs/FilterIconTick';
export type Props = {
  navigation: any;
};

const Header = (Props: any) => {
  let {
    navigation,
    Drawer,
    backBtn,
    backBtnJT,
    backBtnColor,
    filter,
    addClass,
    title,
    plus,
    noLogo,
    myStyle,
    tab,
    containerStyle,
    recordsFilter,
    BackBtn,
    noTop,
    needHelp
  } = Props;


  const routeToFilter = async () => {

    let selectedTab = tab.filter((e: any, i: number) => {
      return e.selected
    })

    if (selectedTab[0]?.name == "Applied") {

      navigation.navigate('Filter', "applied")

    } else {
      navigation.navigate('Filter')
    }
  }

  
  const [filterApplied, setFilterApplied] = useState<{ tab0: boolean; tab1: boolean; recordsFilter: boolean }>({
    tab0: false,
    tab1: false,
    recordsFilter: false
  });



  useFocusEffect(
    React.useCallback(() => {
      const checkFilterStatus = async () => {
        try {
          // Check filter for tab[0]
          if (tab[0]?.selected) {
            const filterTab0 = await AsyncStorage.getItem('filter');
            setFilterApplied(prevState => ({
              ...prevState,
              tab0: !!filterTab0
            }));
          } else {
            setFilterApplied(prevState => ({
              ...prevState,
              tab0: false
            }));
          }

          // Check filter for tab[1]
          if (tab[1]?.selected) {
            const filterTab1 = await AsyncStorage.getItem("statusFilter");
            setFilterApplied(prevState => ({
              ...prevState,
              tab1: !!filterTab1
            }));
          } else {
            setFilterApplied(prevState => ({
              ...prevState,
              tab1: false
            }));
          }

        } catch (error) {
          console.error("Error retrieving filter from AsyncStorage:", error);
          setFilterApplied({ tab0: false, tab1: false, recordsFilter: false });
        }
      };

      checkFilterStatus();
    }, [tab, ]) // Dependency array includes tab and recordsFilter to rerun effect when they change
  );

  const [isClassRecordFilter, setIsClassRecordFilter] = useState(false)

  const checkFilterStatus = async () => {
    try {
      if (recordsFilter) {
        const recordsStatus = await AsyncStorage.getItem('ClassRecordsFilter');
        const status = JSON.parse(recordsStatus || '{}');
        console.log("status", status);

        if (status.option) {
          setIsClassRecordFilter(true);
        } else {
          setIsClassRecordFilter(false);
        }
      } else {
        setIsClassRecordFilter(false);
      }
    } catch (error) {
      console.error("Error retrieving filter from AsyncStorage:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkFilterStatus();
    }, [recordsFilter])
  );

  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      checkFilterStatus();
    });

    return unsubscribe;
  }, [navigation]);

  



  const routeToRecordFilter = () => {
    navigation.navigate('Filter', "tutorrecords")
  }


  const previousRouteName = navigation?.getState().routes[navigation.getState().routes.length - 2]?.name;

  // console.log("Previous Route Name:", previousRouteName);
  const handleGoBack = () => {
    if (previousRouteName == undefined) {
      navigation.replace("Main", {
        screen: "Home",
      });
      // navigation.replace("Main");
    } else {
      navigation.goBack(); // Navigate back to the previous screen if possible
    }
  };


  return (
    <>
      <View style={{
        margin: noTop ? 0 : 20,
      }} />
      <View
        style={{
          backgroundColor: 'rgba(52, 52, 52, 0.0)',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          paddingHorizontal: 20,
          borderBottomColor: 'grey',
          height: 60,
          ...containerStyle
        }}>
        <>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
            }}>
            {backBtnJT && (
              <TouchableOpacity onPress={() => navigation.replace('Main', {
                screen: 'jobTicket',
              })} style={{ padding: 10, paddingLeft: 0, }}>
                <AntDesign name="arrowleft" size={25} color={'black'} />
                {/* <Entypo name="chevron-left" size={25} color={'black'} /> */}
              </TouchableOpacity>
            )}
            {BackBtn && (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, paddingLeft: 0, }}>
                <AntDesign name="arrowleft" size={25} color={'black'} />
                {/* <Entypo name="chevron-left" size={25} color={'black'} /> */}
              </TouchableOpacity>
            )}
            {backBtn &&
              <TouchableOpacity style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', paddingRight: 10, borderRadius: 50 }} onPress={() => handleGoBack()}>
                <Entypo name="chevron-left" size={25} color={'black'} />
                {/* <Image source={require('../../Assets/Images/back.png')} style={{ width: 12, height: 12 }} resizeMode='contain' /> */}
              </TouchableOpacity>
            }
            {title &&
              <Text style={[styles.textType1, { fontFamily: 'Circular Std Bold', width: '100%' }]}>{title}</Text>
            }
          </View>


          {filter ? (
            <View
              style={{
                backgroundColor: Theme.shinyGrey,
                padding: 10,
                borderRadius: 50,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => routeToFilter()}>
                <Text>
                  <Text>
                    {(tab[1]?.selected && filterApplied.tab1) || (tab[0]?.selected && filterApplied.tab0) ? (
                      // <FilterIconTick/>
                      <MaterialCommunityIcons name="filter-check-outline" size={25} color={'black'} />
                    ) : (
                      <MaterialCommunityIcons name="filter-outline" size={25} color={'black'} />
                      // <FilterIcon/>
                    )}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) :
            recordsFilter ? (
              <View style={{
                backgroundColor: Theme.shinyGrey,
                padding: 10,
                borderRadius: 50,
              }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => routeToRecordFilter()}>
                  {isClassRecordFilter? (
                   <MaterialCommunityIcons name="filter-check-outline" size={25} color={'black'} />
                  ) : (
                    <MaterialCommunityIcons name="filter-outline" size={25} color={'black'} />
                  )}
                </TouchableOpacity>
              </View>
            ) :
              addClass ? (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}
                    activeOpacity={0.8}
                    onPress={() => { }}>
                    <Image source={require('../../Assets/Images/plus.png')} style={{ width: 25, height: 25 }} resizeMode='contain' />
                  </TouchableOpacity>
                </View>
              ) : plus ? <View style={{ flex: 1, alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={{
                    // flex: 1,
                    width: 34,
                    height: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    backgroundColor: Theme.darkGray,
                    padding: 5
                  }}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('AddClass')}>
                  <Icon name={"plus"} size={24} color={Theme.white} />
                </TouchableOpacity>
              </View> : needHelp ?
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Circular Std Book', }}>Need Help</Text>
                  <NeedHelp />
                </View>
                :
                (
                  <View style={{}}>
                    <Text></Text>
                  </View>
                )}
        </>
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  button: {
    height: Dimensions.get('window').height / 12,
    width: Dimensions.get('window').width / 5,
  },
  icon: {
    height: Dimensions.get('window').height / 16,
    width: Dimensions.get('window').width / 16,
  },
  logo: {
    // height: Dimensions.get('window').height / 12,
    // width: Dimensions.get('window').width / 2,
    width: 150,
    height: 40,
    alignSelf: 'center',
  },
  textType1: {
    fontWeight: '500',
    fontSize: 24,
    color: Theme.Black,
    fontFamily: 'Circular Std Medium',
    // lineHeight: 24,
    fontStyle: 'normal',
  },
});
