import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Splash from '../Screens/Splash';
import Home from '../Screens/Home';
import { Theme } from '../constant/theme';
import JobTicket from '../Screens/JobTicket';
import Schedule from '../Screens/Schedule';
import Inbox from '../Screens/Inbox';
import More from '../Screens/More';
import Login from '../Screens/Login/Login';
import OnBoarding from '../Screens/OnBoarding';
import Verification from '../Screens/Verification';
import Signup from '../Screens/Signup';
import Filter from '../Screens/Filter';
import OpenDetails from '../Screens/OpenDetails';
import AppliedDetails from '../Screens/AppliedDetails';
import InboxDetail from '../Screens/InboxDetailScreen';
import FAQs from '../Screens/FAQs';
import BackToDashboard from '../Screens/BackToDashboardScreen';
import AttendedClassRecords from '../Screens/AttendedClassRecords';
import Profile from '../Screens/Profile';
import Notifications from '../Screens/Notifications';
import Students from '../Screens/Students';
import PaymentHistory from '../Screens/PaymentHistory';
import ReportSubmission from '../Screens/ReportSubmission';
import ReportSubmissionHistory from '../Screens/ReportSubmissionHistory';
import AddClass from '../Screens/AddClass';
import EditPostpondClass from '../Screens/EditPostpondClass';
import EditCancelledClass from '../Screens/EditCancelledClass';
import ClockIn from '../Screens/ClockInScreen/ClockIn';
import ClockOut from '../Screens/ClockOutScreen';
import ClassTimerCount from '../Screens/ClassTimerCountScreen';
import ScheduleSuccessfully from '../Screens/ScheduleSuccessfully';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomNavigation({navigation,route}: any) {
    return (
      <Tab.Navigator
        // initialRouteName={initialRoute}
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarInactiveTintColor: 'grey',
          tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: 'black',
        })}>
        <>
          <Tab.Screen
            name="Job Ticket"
            component={JobTicket}
            options={{
              tabBarIcon: ({focused, color}) => (
                <View>
                  {focused == true ? (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        padding: 5,
                        borderRadius: 5,
                      }}>
                      <Image
                        source={require('../Assets/Images/Job.png')}
                        resizeMode="contain"
                        style={{
                          height: 50,
                          width: 50,
                          tintColor: focused ? 'black' : 'grey',
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <Image
                        source={require('../Assets/Images/Job.png')}
                        resizeMode="contain"
                        style={{
                          height: 50,
                          width: 50,
                          tintColor: focused ? 'black' : 'grey',
                        }}
                      />
                    </View>
                  )}
                </View>
              ),
            }}
          />
           <Tab.Screen
              name="Schedule"
              component={Schedule}
              options={{
                tabBarIcon: ({focused, color}) => (
                  <View>
                    {focused == true ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          padding: 5,
                          borderRadius: 5,
                        }}>
                        <Image
                          source={require('../Assets/Images/schedule1.png')}
                          resizeMode="contain"
                          style={{
                            height: 50,
                            width: 50,
                            tintColor: focused ? 'black' : 'grey',
                          }}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={require('../Assets/Images/schedule1.png')}
                          resizeMode="contain"
                          style={{
                            height: 50,
                            width: 50,
                            tintColor: focused ? 'black' : 'grey',
                          }}
                        />
                      </View>
                    )}
                  </View>
                ),
              }}
            />
          
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({focused, color}) => (
                  <View>
                    {focused == true ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          // backgroundColor:'#1FC07D',
                        }}>
                        <Image
                          source={require('../Assets/Images/HomeBlue.png')}
                          resizeMode="contain"
                          style={{
                            height: 100,
                            width: 100,
                          }}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={require('../Assets/Images/HomeBlue.png')}
                          resizeMode="contain"
                          style={{
                            height: 100,
                            width: 100,
                          }}
                        />
                      </View>
                    )}
                  </View>
                ),
              }}
            />
          
            <Tab.Screen
              name="Inbox"
              component={Inbox}
              options={{
                tabBarIcon: ({focused, color}) => (
                  <View>
                    {focused == true ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          padding: 5,
                          borderRadius: 5,
                        }}>
                        <Image
                          source={require('../Assets/Images/Group203.png')}
                          resizeMode="contain"
                          style={{
                            height: 35,
                            width: 35,
                            tintColor: focused ? 'black' : 'grey',
                          }}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={require('../Assets/Images/Group203.png')}
                          resizeMode="contain"
                          style={{
                            height: 35,
                            width: 35,
                            tintColor: focused ? 'black' : 'grey',
                          }}
                        />
                      </View>
                    )}
                  </View>
                ),
              }}
            />
          
          <Tab.Screen
            name="More"
            component={More}
            options={{
              tabBarIcon: ({focused, color}) => (
                <View>
                  {focused == true ? (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        padding: 5,
                        borderRadius: 5,
                      }}>
                      <Image
                        source={require('../Assets/Images/Group202.png')}
                        resizeMode="contain"
                        style={{
                          height: 35,
                          width: 35,
                          tintColor: focused ? 'black' : 'grey',
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <Image
                        source={require('../Assets/Images/Group202.png')}
                        resizeMode="contain"
                        style={{
                          height: 35,
                          width: 35,
                          tintColor: focused ? 'black' : 'grey',
                        }}
                      />
                    </View>
                  )}
                </View>
              ),
            }}
          />
        </>
      </Tab.Navigator>
  
    );
  }
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="Main" component={BottomNavigation} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Filter" component={Filter} />
        <Stack.Screen name="OpenDetails" component={OpenDetails} />
        <Stack.Screen name="AppliedDetails" component={AppliedDetails} />
        <Stack.Screen name="InboxDetail" component={InboxDetail} />
        <Stack.Screen name="FAQs" component={FAQs} />
        <Stack.Screen name="BackToDashboard" component={BackToDashboard} />
        <Stack.Screen name="AttendedClassRecords" component={AttendedClassRecords} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Students" component={Students} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
        <Stack.Screen name="ReportSubmission" component={ReportSubmission} />
        <Stack.Screen name="AddClass" component={AddClass} />
        <Stack.Screen name="EditPostpondClass" component={EditPostpondClass} />
        <Stack.Screen name="EditCancelledClass" component={EditCancelledClass} />
        <Stack.Screen name="ClockIn" component={ClockIn} />
        <Stack.Screen name="ClockOut" component={ClockOut} />
        <Stack.Screen name="ClassTimerCount" component={ClassTimerCount} />
        <Stack.Screen name="ReportSubmissionHistory" component={ReportSubmissionHistory} />
        <Stack.Screen name="ScheduleSuccessfully" component={ScheduleSuccessfully} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({
    customFont: {
        fontFamily: 'Circular Std Black',
      },
    
      tabBarStyle: {
        borderTopWidth: 0,
        height: 105,
        backgroundColor: Theme.white,
      },
});
