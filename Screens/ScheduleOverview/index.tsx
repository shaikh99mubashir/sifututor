import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import HiglightCircle from '../../SVGs/ScheduleOverviewIcon/HiglightCircle';
import SubjectIcon from '../../SVGs/SubjectIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import moment from 'moment';
import scheduleContext from '../../context/scheduleContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useIsFocused } from '@react-navigation/native';
import MonthPicker from 'react-native-month-year-picker';
import UpCommingCarousel from '../../Component/UpCommingCarousel';
import CustomLoader from '../../Component/CustomLoader';

const ScheduleOverview = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  let context = useContext(scheduleContext);
  let { scheduleData, setScheduleData } = context;
  const [scheduleOverView, setScheduleOverView] = useState<any>([])
  const [selectedDate, setSelectedDate] = useState(new Date());
  // console.log("scheduleOverView",scheduleOverView);

  const currentDate = new Date(); // Get the current date
  const currentDay = currentDate.getDate(); // Get the day of the month
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' }); // Get the month
  const currentMonthShort = currentDate.toLocaleString('default', {
    month: 'short',
  }); // Get the month
  const currentYear = currentDate.getFullYear(); // Get the year

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    setTimeout(() => {
      // setRefreshing(false);
      // setOpenPPModal(true);
      setRefresh(!refresh);
      // getTutorId();
    }, 2000);
  }, [refresh]);
  // const dates = getCurrentMonthDates();
  const flatListRef = useRef<FlatList>(null);
  
  // useEffect(() => {
  //   // Find the index of the current date
  //   const currentIndex = dates.findIndex(date => date.isCurrentDate);
  //   // Scroll to the current date if found
  //   if (currentIndex !== -1 && flatListRef.current) {
  //     flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
  //   }
  // }, []);
  const getItemLayout = (data: any, index: number): any => ({
    length: 130, // Adjust the height of each item as per your design
    offset: 70 * index,
    index,
  });
  const [upCommingClasses, setUpCommingClasses] = useState([]);
  const getUpcomingClasses = async () => {
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData = JSON.parse(login);
    let { tutorID } = loginData;
    axios
      .get(`${Base_Uri}getUpcomingClassesByTutorID/${tutorID}`)
      .then(({ data }) => {
        const { classSchedules } = data;
        setUpCommingClasses(classSchedules);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {

    getUpcomingClasses();

  }, []);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemPress = (itemId: any) => {
    setSelectedItem(itemId === selectedItem ? null : itemId);
  };
  const [leftBorderHeight, setLeftBorderHeight] = useState(0);
  let focus = useIsFocused();
  const getScheduledData = async (item: any) => {
    setLoading(true);
    console.log("item", item);
    setSelectedDate(new Date(item.isoDate)); 
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(login);
    let { tutorID } = loginData;


    let selectedDate = new Date(item?.selectedDate);
    axios
      .get(`${Base_Uri}getClassSchedulesTime/${tutorID}`)
      .then(({ data }) => {
        let { classSchedulesTime } = data;

        let Date = selectedDate.getDate();
        let month = selectedDate.getMonth();
        let year = selectedDate.getFullYear();

        classSchedulesTime =
          classSchedulesTime && classSchedulesTime.length > 0
            ? classSchedulesTime
              .map((e: any, i: number) => {

                let getDate: any = moment(e.date);

                let convertDate = getDate.toDate();
                let scheduleDate = convertDate.getDate();
                let scheduleMonth = convertDate.getMonth();
                let scheduleYear = convertDate.getFullYear();

                if (
                  Date == scheduleDate &&
                  month == scheduleMonth &&
                  year == scheduleYear
                ) {
                  return {
                    ...e,
                    imageUrl: require('../../Assets/Images/student.png'),
                  };
                } else {
                  return false;
                }
              })
              .filter(Boolean)
            : [];

        setLoading(false);
        let dataToSend = [...classSchedulesTime];
        console.log("dataToSend", dataToSend);

        setScheduleOverView(dataToSend);
      })
      .catch(error => {
        setLoading(false);
        console.log("error", error);

      });
  };



  // useEffect(() => {
  //   if (refresh || selectedDate || data || scheduleData.length == 0) {
  //     getScheduledData();
  //   }
  // }, [refresh, data, focus]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


  function convertTo12HourFormat(time24: string | null): string {
    if (!time24) {
      return ''; // Return an empty string or some default value when time24 is null
    }
    const [hourStr, minuteStr] = time24.split(':');
    const hour = parseInt(hourStr);
    let period = 'AM';
    let twelveHour = hour;

    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) {
        twelveHour = hour - 12;
      }
    }

    if (twelveHour === 0) {
      twelveHour = 12;
    }

    return `${twelveHour}:${minuteStr} ${period}`;
  }

  const formatTime = (timeString: any) => {
    // Extract the time and AM/PM part
    const [time, period] = timeString.split(' ');
    const [hours] = time.split(':');

    // Format the hour with AM/PM
    return `${hours} ${period}`;
  };

  const renderClassScheduleData = ({ item }: any) => {
    const startTime12Hour = convertTo12HourFormat(item.startTime);
    const endTime12Hour = convertTo12HourFormat(item.endTime);
    const formattedTime = formatTime(item.startTime);
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderLeftWidth: 1,
            gap: 8,
            borderLeftColor: Theme.lineColor,
            marginLeft: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            {selectedItem == item.id ?
              <View style={{ position: 'relative', right: 6 }}>
                <HiglightCircle />
              </View>
              :
              <View style={{ position: 'relative', right: 6 }}>
                <HiglightCircle color={Theme.white} />
              </View>
            }
            <Text style={styles.textType3}>{formattedTime}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleItemPress(item.id)}
            style={{
              borderWidth: 1,
              borderRadius: 20,
              marginBottom: 10,
              padding: 10,
              borderColor: selectedItem == item.id ? Theme.darkGray : Theme.shinyGrey,
              backgroundColor: Theme.white,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: Dimensions.get('window').width / 1.65,
                borderColor: Theme.shinyGrey,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={[styles.textType1, { fontSize: 20 }]}>
                  {item?.studentName.length > 8 ? `${item?.studentName.slice(0, 8)}..` : item?.studentName}
                </Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={{
                  backgroundColor:
                    item.mode == 'online' ? '#298CFF33' : Theme.lightPrimary,
                  borderRadius: 30,
                }}>

                  <Text
                    style={[
                      styles.textType3,
                      {
                        color:
                          item.mode == 'online' ? Theme.DodgerBlue : Theme.Primary,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        textTransform: 'capitalize',
                      },
                    ]}>
                    {item?.mode}
                  </Text>
                </View>
              </View>
            </View>
            {item?.mode == 'Physical' && (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <Feather name="map-pin" size={14} color={'#003E9C'} />
                <Text style={[styles.textType3, { color: '#003E9C', fontSize: 14 }]}>
                  {item?.city}
                </Text>
              </View>
            )}
            <View
              style={{
                borderWidth: 1,
                borderColor: Theme.LightPattensBlue,
                marginTop: 10,
              }}></View>
            <View
              style={{
                paddingVertical: 10,
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
                    gap: 10,
                  }}>
                  <SubjectIcon />
                  <Text style={[styles.textType3, { color: Theme.IronsideGrey }]}>
                    Subject
                  </Text>
                </View>
                <Text
                  style={[
                    styles.textType1,
                    { fontSize: 16, textTransform: 'capitalize' },
                  ]}>
                  {item.subjectName ?? item?.subject_name}
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
                  <Entypo name="back-in-time" size={18} color={Theme.darkGray} />
                  <Text style={[styles.textType3, { color: Theme.IronsideGrey }]}>
                    Time
                  </Text>
                </View>
                <Text
                  style={[
                    styles.textType1,
                    { fontSize: 16, textTransform: 'capitalize' },
                  ]}>
                  {startTime12Hour} - {endTime12Hour}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const [monthYear, setMonthYear] = useState(new Date());
  // console.log("monthYear",monthYear);
  
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const showPickerMonthAndYear = useCallback((value: any) => setShowMonthPicker(value), []);
  // console.log("monthYear", monthYear);

  const onValueChangeMonthPicker = useCallback(
    (event: any, newDate: any) => {
      const selectedDate = newDate || monthYear;

      showPickerMonthAndYear(false);
      setMonthYear(selectedDate);
      
    },
    [monthYear, showPickerMonthAndYear, ],
  );


  const getCurrentMonthDates = (monthYear: any) => {

    const currentDate = new Date(monthYear);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(Date.UTC(currentYear, currentMonth, i));
      const formattedDate = String(i).padStart(2, '0');
      const isCurrentDate = currentDay === i;
      const isoDate = date.toISOString().split('T')[0];

      dates.push({
        id: i,
        dates: date.getUTCDate(),
        date: formattedDate,
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getUTCDay()],
        isCurrentDate,
        selectedDate: date.toISOString(),
        isoDate: isoDate
      });
    }
    return dates;
  };

  const getDaysInMonth = (date: any) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-based month, so add 1
    return new Date(year, month, 0).getDate();
  };

  const generateDatesForMonth = (date: any) => {
    const daysInMonth = getDaysInMonth(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      dates.push({
        date: currentDate.getDate(),
        day: currentDate.toLocaleString('en-US', { weekday: 'short' }), // Get the day of the week
        isCurrentDate: false // You can add logic here to determine if this is the current date
      });
    }

    return dates;
  };

  let selectedDates = getCurrentMonthDates(monthYear);
  // console.log("selectedDates",selectedDates);

  useEffect(() => {
    const currentDateItem = selectedDates.find(item => item.isCurrentDate);
    if (currentDateItem) {
      getScheduledData(currentDateItem);
      const currentIndex = selectedDates.indexOf(currentDateItem);
      flatListRef?.current?.scrollToIndex({ index: currentIndex, animated: true });
    }
  }, [monthYear]);
  

  // console.log("selectedDates",selectedDates);

  // const renderItem = ({ item }:any) => {
  //   const itemDate = item.selectedDate.split('T')[0];
  //   const isCurrentDate = item.isCurrentDate;
  //   const isSelectedDate = itemDate === item.isoDate;

  //   return (
  //     <TouchableOpacity onPress={() => getScheduledData(item)}>
  //       <View
  //         style={{
  //           alignItems: 'center',
  //           paddingVertical: 15,
  //           width: 68,
  //           backgroundColor: isCurrentDate || isSelectedDate ? 'black' : Theme.white,
  //           marginRight: 5,
  //           borderRadius: 16,
  //           gap: 10,
  //         }}>
  //         <Text
  //           style={[
  //             styles.textType3,
  //             {
  //               color: isCurrentDate || isSelectedDate ? Theme.white : Theme.IronsideGrey,
  //               fontSize: 14,
  //             },
  //           ]}>
  //           {item.day}
  //         </Text>
  //         <View style={{
  //           backgroundColor: isCurrentDate || isSelectedDate ? Theme.darkGray : Theme.white,
  //           borderRadius: 10,
  //         }}>
  //           <Text
  //             style={[
  //               styles.textType1,
  //               {
  //                 fontSize: 28,
  //                 color: isCurrentDate || isSelectedDate ? Theme.white : Theme.Black,
  //                 paddingHorizontal: 6,
  //                 paddingVertical: 7,
  //                 textAlign: 'center',
  //                 top: 5
  //               },
  //             ]}>
  //             {item.date}
  //           </Text>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };
  const renderItem = ({ item }:any) => {
    
    const isSelectedDate = moment(item.selectedDate).isSame(selectedDate, 'day');
    
    return (
      <TouchableOpacity onPress={() => getScheduledData(item)}>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 15,
            width: 68,
            backgroundColor: isSelectedDate ? 'black'  : Theme.white,

            marginRight: 5,
            borderRadius: 16,
            gap: 10,
          }}>
          <Text
            style={[
              styles.textType3,
              {
                color: isSelectedDate ? Theme.white : Theme.IronsideGrey,
                fontSize: 14,
              },
            ]}>
            {item.day}
          </Text>
          <View style={{
            backgroundColor: isSelectedDate ? Theme.darkGray : Theme.white,
            borderRadius: 10,
          }}>
            <Text
              style={[
                styles.textType1,
                {
                  fontSize: 28,
                  color: isSelectedDate ? Theme.white : Theme.Black,
                  paddingHorizontal: 6,
                  paddingVertical: 7,
                  textAlign: 'center',
                  top: 5
                },
              ]}>
              {item.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // const renderItem = ({ item }: any) => {
  //   return (
  //     <TouchableOpacity onPress={() => getScheduledData(item)}>
  //       <View
  //         style={{
  //           alignItems: 'center',
  //           paddingVertical: 15,
  //           width: 68,
  //           backgroundColor: item.isCurrentDate ? 'black' : Theme.white,
  //           marginRight: 5,
  //           borderRadius: 16,
  //           gap: 10,
  //         }}>
  //         <Text
  //           style={[
  //             styles.textType3,
  //             {
  //               color: item.isCurrentDate ? Theme.white : Theme.IronsideGrey,
  //               fontSize: 14,
  //             },
  //           ]}>
  //           {item.day}
  //         </Text>
  //         <View style={{
  //           backgroundColor: item.isCurrentDate ? Theme.darkGray : Theme.white,
  //           borderRadius: 10,
  //         }}>

  //           <Text
  //             style={[
  //               styles.textType1,
  //               {
  //                 fontSize: 28,
  //                 color: item.isCurrentDate ? Theme.white : Theme.Black,
  //                 paddingHorizontal: 6,
  //                 paddingVertical: 7,
  //                 textAlign: 'center',
  //                 top: 5
  //               },
  //             ]}>
  //             {item.date}
  //           </Text>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };


  return (
    <View
      style={{
        backgroundColor: Theme.GhostWhite,
        height: '100%',
      }}>
      <Header title={'Schedule Overview'} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 25 }}>
          <View style={{ margin: 10 }}></View>
          {/* Today */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text style={[styles.textType1, { fontSize: 22 }]}>Today</Text>
              <Text style={[styles.textType3, { color: Theme.IronsideGrey }]}>
                {currentDay} {currentMonth} {currentYear}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, top: -6 }}>
              <TouchableOpacity
                // onPress={showDatePicker}
                onPress={() => showPickerMonthAndYear(true)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: Theme.white,
                  flexDirection: 'row',
                  gap: 15,
                  paddingVertical: 5,
                  alignItems: 'center',
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: Theme.lineColor,
                }}>
                <Text style={[styles.textType3]}>
                  {/* {currentMonthShort} {currentYear} */}
                  {monthYear.toLocaleDateString([], {
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
                <EvilIcons name="calendar" size={22} color={Theme.Dune} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ margin: 10 }}></View>
          <View>
            <FlatList
              ref={flatListRef}
              data={selectedDates}
              renderItem={renderItem}
              keyExtractor={item => item?.id?.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              getItemLayout={getItemLayout}
            />
          </View>
          <View style={{ margin: 10 }}></View>
          <View style={{ width: 10, height: 20, backgroundColor: Theme.GhostWhite, position: 'relative', top: 20, left: 5, zIndex: 1 }}></View>
          <View>
            {scheduleOverView && scheduleOverView.length > 0 ?
              <FlatList
                data={scheduleOverView}
                renderItem={renderClassScheduleData}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
              :
              <View
                style={{
                  // height: Dimensions.get('window').height - 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={require('../../Assets/Images/noclassyet.png')} />
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: Theme.black,
                    fontFamily: 'Circular Std Black',
                    marginTop: 20,
                  }}>
                  No Class, Yet
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: Theme.gray,
                    textAlign: 'center',
                    marginTop: 10,
                    fontFamily: 'Circular Std Black',
                  }}>
                  Look like you haven't added any class.
                </Text>
              </View>
            }
          </View>
          <View style={{ width: 10, height: 30, backgroundColor: Theme.GhostWhite, position: 'relative', top: -30, left: 5, zIndex: 1 }}></View>
        </View>

        {/* {showMonthPicker && (
          <MonthPicker
            onChange={onValueChangeMonthPicker}
            value={monthYear}
            minimumDate={new Date()}
            maximumDate={new Date(2025, 5)}
          />
        )} */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={showMonthPicker}
          onRequestClose={() => showPickerMonthAndYear(false)}
        >
          <View style={styles.modalContainer}>
            <View style={{
              position: 'relative',
              left: -170,
            }} >
              <MonthPicker
                onChange={onValueChangeMonthPicker}
                value={monthYear}
                locale="en"
              />
              <Button title="Done" onPress={() => showPickerMonthAndYear(false)} />
            </View>
          </View>
        </Modal>

        <View style={{ margin: 10 }}></View>
        {upCommingClasses &&
          <View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 20,
                paddingHorizontal: 25,
              }}>
              <Text style={[styles.textType1, { fontFamily: 'Circular Std Medium',lineHeight:30 }]}>
                Upcoming Classes
              </Text>
            </View>
            <View style={{ padding: 15, paddingHorizontal: 25 }}>
              {upCommingClasses && upCommingClasses.length > 0 ? (
                <View>
                  <UpCommingCarousel upCommingClassesdata={upCommingClasses} />
                </View>
              ) : (
                <View style={{ marginTop: 35 }}>
                  <Text style={[styles.textType3, { textAlign: 'center' }]}>
                   No Upcoming Classes
                  </Text>
                </View>
              )}
            </View>
            <View style={{ margin: 0 }}></View>
          </View>
        }
        <CustomLoader visible={loading}/>
        <View style={{ margin: 20 }}></View>
      </ScrollView>
    </View>
  );
};

export default ScheduleOverview;

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },

});