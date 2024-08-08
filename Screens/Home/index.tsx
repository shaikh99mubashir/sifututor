import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
  Modal,
  Linking,
  Button,
} from 'react-native';
import { Theme } from '../../constant/theme';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import { useIsFocused } from '@react-navigation/native';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import StudentContext from '../../context/studentContext';
import filterContext from '../../context/filterContext';
import upcomingClassContext from '../../context/upcomingClassContext';
import paymentContext from '../../context/paymentHistoryContext';
import scheduleContext from '../../context/scheduleContext';
import reportSubmissionContext from '../../context/reportSubmissionContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import notificationContext from '../../context/notificationContext';
import bannerContext from '../../context/bannerContext';
import messaging from '@react-native-firebase/messaging';
import scheduleNotificationContext from '../../context/scheduleNotificationContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomLoader from '../../Component/CustomLoader';
import subscribeToChannel from '../../Component/subscribeToChannel';
import Money from '../../SVGs/Money';
import Student from '../../SVGs/Student';
import Clock from '../../SVGs/Clock';
import Schedule from '../../SVGs/Schedule';
import UpCommingCarousel from '../../Component/UpCommingCarousel';
import DiagArrow from '../../SVGs/DiagArrow/Index';
import Toast from 'react-native-toast-message';
import { getFcmToken } from '../../src/utils/fcmHelper';
import JobTicketCarousel from '../../Component/JobTicketCarousel';
import LatestNews from '../../Component/LatestNews';
import CustomButton from '../../Component/CustomButton';
import MonthPicker from 'react-native-month-year-picker';
import VerifyBanner from '../../SVGs/VerifyBanner';
import BackToDashboard from '../../Component/BackToDashboard';
function Home({ navigation, route }: any) {
  let key = route.key;

  const scheduleNotCont = useContext(scheduleNotificationContext);

  let { scheduleNotification, setScheduleNotification } = scheduleNotCont;

  const context = useContext(TutorDetailsContext);
  const filter = useContext(filterContext);
  const studentAndSubjectContext = useContext(StudentContext);
  const notContext = useContext(notificationContext);
  let { notification, setNotification } = notContext;
  const { setCategory, setSubjects, setState, setCity } = filter;
  const [refreshing, setRefreshing] = useState(false);
  const upcomingClassCont = useContext(upcomingClassContext);
  const paymentHistory = useContext(paymentContext);
  const bannerCon = useContext(bannerContext);

  let {
    homePageBanner,
    setHomePageBanner,
    schedulePageBannner,
    setSchedulePageBanner,
    jobTicketBanner,
    setJobTicketBanner,
    profileBanner,
    setProfileBanner,
    paymentHistoryBanner,
    setPaymentHistoryBanner,
    reportSubmissionBanner,
    setReportSubmissionBanner,
    inboxBanner,
    setInboxBanner,
    faqBanner,
    setFaqBanner,
    studentBanner,
    setStudentBanner,
  } = bannerCon;

  const upcomingContext = useContext(scheduleContext);

  let { commissionData, setCommissionData } = paymentHistory;
  let { upcomingClass, setUpcomingClass, scheduleData, setScheduleData } =
    upcomingContext;

  const { tutorDetails, updateTutorDetails } = context;
  const { students, subjects, updateStudent, updateSubject } =
    studentAndSubjectContext;
  let reportContext = useContext(reportSubmissionContext);

  let {
    reportSubmission,
    setreportSubmission,
    progressReport,
    setProgressReport,
  } = reportContext;

  const focus = useIsFocused();

  const date: Date = new Date();
  const currentDate: string = date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const currentMonth: string = date.toLocaleDateString('en-US', {
    month: 'long',
  });

  const [upCommingClasses, setUpCommingClasses] = useState([]);
  const [jobTicketData, setJobTicketData] = useState([]);
  const [latestNewsData, setLatestNewsData] = useState([]);
  const [notificationLenght, setNotificationLength] = useState(0);
  const [tutorId, setTutorId] = useState<Number | null>(null);
  const [classInProcess, setClassInProcess] = useState({});

  const [tutorData, setTutorData] = useState({
    cummulativeCommission: '',
    attendedHours: '',
    activeHours: '',
    cancelledHours: '',
    scheduledHours: '',
  });

  const [cummulativeCommission, setCumulativeCommission] = useState('');
  const [attendedHours, setAttendedHours] = useState('');
  const [activeHours, setActiveHours] = useState('');
  const [cancelledHours, setCancelledHours] = useState('');
  const [schedulesHours, setScheduledHours] = useState('');
  const [tutorStudents, setTutorStudents] = useState([]);
  const [bannerData, setBannerData] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setOpenPPModal(true);
      getTutorId();
    }, 2000);
  }, [refreshing]);

  const getTutorId = async () => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);

    let { tutorID } = loginData;
    setTutorId(tutorID);
  };

  const getPaymentHistory = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');
    data = JSON.parse(data);
    let { tutorID } = data;

    axios
      .get(`${Base_Uri}tutorPayments/${tutorID}`)
      .then(({ data }) => {
        let { response } = data;

        setCommissionData(response);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getNotificationLength = async () => {
    axios
      .get(`${Base_Uri}api/notifications/${tutorId}`)
      .then(({ data }) => {
        let length = 0;
        let { notifications } = data;
        let tutorNotification =
          notifications.length > 0 &&
          notifications.filter((e: any, i: number) => {
            return e.status == 'new';
          });
        setNotification(tutorNotification);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getClassInProcess = async () => {
    let data: any = await AsyncStorage.getItem('classInProcess');
    data = JSON.parse(data);

    setClassInProcess(data);
  };

  const sendDeviceTokenToDatabase = () => {
    messaging()
      .requestPermission()
      .then(() => {
        // Retrieve the FCM token
        return messaging().getToken();
      })
      .then(token => {
        messaging()
          .subscribeToTopic('all_devices')
          .then(() => {
            console.log(token, 'token');

            let formData = new FormData();

            formData.append('tutor_id', tutorId);
            formData.append('device_token', token);

            axios
              .post(`${Base_Uri}api/getTutorDeviceToken`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then(res => {
                let data = res.data;
                console.log(data, 'tokenResponse');
              })
              .catch(error => {
                console.log(error, 'error');
              });
          })
          .catch(error => {
            console.error('Failed to subscribe to topic: all_devices', error);
          });
      })
      .catch(error => {
        console.error(
          'Error requesting permission or retrieving token:',
          error,
        );
      });
  };
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
  };

  async function DisplayNotification(remoteMessage: any) {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
      },
    });
  }

  useEffect(() => {
    requestPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      DisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, [focus]);

  // useEffect(() => {
  //   if (tutorId) {
  //     sendDeviceTokenToDatabase();
  //   }
  // }, [tutorId]);

  // console.log(tutorDetails, 'details');

  useEffect(() => {
    getTutorId();
    getClassInProcess();
  }, [focus, refreshing]);

  const getCategory = () => {
    axios
      .get(`${Base_Uri}getCategories`)
      .then(({ data }) => {
        let { categories } = data;

        let myCategories =
          categories &&
          categories.length > 0 &&
          categories.map((e: any, i: Number) => {
            if (e.category_name) {
              return {
                subject: e.category_name,
                id: e.id,
              };
            }
          });
        setCategory(myCategories);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getSubject = () => {
    axios
      .get(`${Base_Uri}getSubjects`)
      .then(({ data }) => {
        let { subjects } = data;

        let mySubject =
          subjects &&
          subjects.length > 0 &&
          subjects.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });

        setSubjects(mySubject);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getStates = () => {
    axios
      .get(`${Base_Uri}getStates`)
      .then(({ data }) => {
        let { states } = data;

        let myStates =
          states &&
          states.length > 0 &&
          states.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });
        setState(myStates);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getCities = () => {
    axios
      .get(`${Base_Uri}getCities`)
      .then(({ data }) => {
        let { cities } = data;
        let myCities =
          cities &&
          cities.length > 0 &&
          cities.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });
        setCity(myCities);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getReportSubmissionHistory = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let { tutorID } = data;

    axios
      .get(`${Base_Uri}api/tutorFirstReportListing/${tutorID}`)
      .then(({ data }) => {
        let { tutorReportListing } = data;
        setreportSubmission(tutorReportListing);
      })
      .catch(error => {
        console.log('error');
      });
  };

  const getProgressReportHistory = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let { tutorID } = data;

    axios
      .get(`${Base_Uri}api/progressReportListing`)
      .then(({ data }) => {
        let { progressReportListing } = data;

        let tutorReport =
          progressReportListing &&
          progressReportListing.length > 0 &&
          progressReportListing.filter((e: any, i: number) => {
            return e.tutorID == tutorID;
          });
        setProgressReport(
          tutorReport && tutorReport.length > 0 ? tutorReport : [],
        );
      })
      .catch(error => {
        console.log('error');
      });
  };

  useEffect(() => {
    getCategory();
    getSubject();
    getStates();
    getCities();
    getPaymentHistory();
    getReportSubmissionHistory();
    getProgressReportHistory();
  }, [refreshing]);

  const getTutorDetails = async () => {
    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorId}`)
      .then(({ data }) => {
        if (data.tutorDetailById == null) {
          AsyncStorage.removeItem('loginAuth');
          navigation.replace('Login');
          updateTutorDetails('');
          // ToastAndroid.show('Terminated', ToastAndroid.SHORT);
          Toast.show({
            type: 'info',
            // text1: 'Request timeout:',
            text2: `Terminated`,
            position: 'bottom'
          });
          return;
        }
        let { tutorDetailById } = data;

        let tutorDetails = tutorDetailById[0];

        let details = {
          full_name: tutorDetails?.full_name,
          email: tutorDetails?.email,
          displayName: tutorDetails?.displayName,
          gender: tutorDetails?.gender,
          phoneNumber: tutorDetails.phoneNumber,
          age: tutorDetails.age,
          nric: tutorDetails.nric,
          tutorImage: tutorDetails.tutorImage,
          tutorId: tutorDetails?.id,
          status: tutorDetails?.status,
        };

        updateTutorDetails(details);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getScheduleNotification = () => {
    axios
      .get(`${Base_Uri}api/classScheduleStatusNotifications/${tutorId}`)
      .then(res => {
        let { data } = res;
        setScheduleNotification(data.record);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    tutorId && getNotificationLength();
    tutorId && getTutorDetails();
    tutorId && getScheduleNotification();
  }, [tutorId, refreshing]);

  const getCummulativeCommission = () => {
    axios
      .get(`${Base_Uri}getCommulativeCommission/${tutorId}`)
      .then(({ data }) => {
        setCumulativeCommission(data.commulativeCommission);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getAttendedHours = () => {
    axios
      .get(`${Base_Uri}getAttendedHours/${tutorId}`)
      .then(({ data }) => {
        setAttendedHours(data.attendedHours);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getScheduledHours = () => {
    axios
      .get(`${Base_Uri}getScheduledHours/${tutorId}`)
      .then(({ data }) => {
        setScheduledHours(data.scheduledHours);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getCancelledHours = () => {
    axios
      .get(`${Base_Uri}getCancelledHours/${tutorId}`)
      .then(({ data }) => {
        setCancelledHours(data.cancelledHours);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };
  const [assignedTickets, setAssignedTickets] = useState();
  const getAssignedTicket = () => {
    axios
      .get(`${Base_Uri}getAssignedTickets/${tutorId}`)
      .then(({ data }) => {
        setAssignedTickets(data.assignedTickets);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getTutorStudents = () => {
    axios
      .get(`${Base_Uri}getTutorStudents/${tutorId}`)
      .then(({ data }) => {
        const { tutorStudents } = data;
        setTutorStudents(tutorStudents);
        updateStudent(tutorStudents);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getTutorSubjects = () => {
    axios
      .get(`${Base_Uri}getTutorSubjects/${tutorId}`)
      .then(({ data }) => {
        let { tutorSubjects } = data;

        let mySubject =
          tutorSubjects &&
          tutorSubjects.length > 0 &&
          tutorSubjects.map((e: any, i: Number) => {
            if (e?.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });
        updateSubject(mySubject);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getUpcomingClasses = () => {
    axios
      .get(`${Base_Uri}getUpcomingClassesByTutorID/${tutorId}`)
      .then(({ data }) => {
        const { classSchedules } = data;
        setUpCommingClasses(classSchedules);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };
  const gettutorNewsStatusList = () => {
    axios
      .get(`${Base_Uri}api/news`)
      .then(({ data }) => {
        let { news } = data;
        setLatestNewsData(news)

      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };
  const getTicketsData = () => {
    axios
      .get(`${Base_Uri}ticketsAPI/${tutorId}`)
      .then(({ data }) => {

        const { tickets } = data;
        // Slice the array to get only the first 10 records
        const limitedJobTicketData = tickets.slice(0, 5);
        setJobTicketData(limitedJobTicketData);
      })
      .catch(error => {
        // Optionally handle the error
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        console.error('Error fetching tickets data:', error);
      });
  };



  useEffect(() => {
    if (tutorId) {
      getCummulativeCommission();
      getDashboardData()
    }
  }, [tutorId, refreshing, focus]);

  useEffect(() => {
    if (tutorId) {
      getUpcomingClasses();
      getTicketsData();
      gettutorNewsStatusList();
    }
  }, [tutorId, refreshing, focus]);

  useEffect(() => {
    if (tutorId && cummulativeCommission) {
      getAttendedHours();
      getScheduledHours();
      getTutorStudents();
      getTutorSubjects();
      getCancelledHours();
      getAssignedTicket();
      getDashboardData()
    }
  }, [cummulativeCommission, refreshing, tutorId, focus]);
  useEffect(() => {
    const unsubscribe = subscribeToChannel({
      channelName: 'mobile-home-page-updated',
      eventName: 'App\\Events\\MobileHomePageUpdated',
      callback: (data: any) => {
        console.log('Event received:', data);
        if (tutorId && cummulativeCommission) {
          getCummulativeCommission()
          getDashboardData()
          getAttendedHours();
          getScheduledHours();
          getTutorStudents();
          getTutorSubjects();
          getCancelledHours();
          getAssignedTicket();
        }
      },
    });

    return unsubscribe;
  }, [focus, cummulativeCommission, refreshing]);



  const routeToScheduleScreen = async (item: any) => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(login);
    let { tutorID } = loginData;
    axios
      .get(`${Base_Uri}getClassSchedulesTime/${tutorID}`)
      .then(res => {
        let scheduledClasses = res.data;

        let { classSchedulesTime } = scheduledClasses;
        let checkRouteClass =
          classSchedulesTime &&
          classSchedulesTime.length > 0 &&
          classSchedulesTime.filter((e: any, i: number) => {
            return e?.id == item?.id;
          });
        checkRouteClass =
          checkRouteClass &&
          checkRouteClass.length > 0 &&
          checkRouteClass.map((e: any, i: number) => {
            return {
              ...e,
              imageUrl: require('../../Assets/Images/student.png'),
            };
          });
        setUpcomingClass(
          checkRouteClass && checkRouteClass.length > 0 ? checkRouteClass : [],
        );
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
    navigation.navigate('Schedule');
  };
  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true);
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(async ({ data }) => {
        let myHomeBanners: any = [];
        let myFaqBanners: any = [];
        let myScheduleBanners: any = [];
        let myStudentBanners: any = [];
        let myInboxBanners: any = [];
        let myProfileBanners: any = [];
        let myPaymentBanners: any = [];
        let myTicketBanners: any = [];
        let myReportBanners: any = [];

        let banners = data.bannerAds;

        let homePageBanner =
          banners &&
          banners.length > 0 &&
          banners.map((e: any, i: any) => {
            if (e.displayOnPage == 'Dashboard') {
              myHomeBanners.push(e);
            } else if (e.displayOnPage == 'Faq') {
              myFaqBanners.push(e);
            } else if (e.displayOnPage == 'Class Schedule List') {
              myScheduleBanners.push(e);
            } else if (e.displayOnPage == 'Student List') {
              myStudentBanners.push(e);
            } else if (e.displayOnPage == 'Inbox') {
              myInboxBanners.push(e);
            } else if (e.displayOnPage == 'Profile') {
              myProfileBanners.push(e);
            } else if (e.displayOnPage == 'Payment History') {
              myPaymentBanners.push(e);
            } else if (e.displayOnPage == 'Job Ticket List') {
              myTicketBanners.push(e);
            } else if (e.displayOnPage == 'Submission History') {
              myReportBanners.push(e);
            }
          });

        if (myHomeBanners && myHomeBanners.length > 0) {
          let sort: any = myHomeBanners.sort(
            (a: any, b: any): any =>
              new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];

          let dataInStorage: any = await AsyncStorage.getItem('homePageBanner');

          dataInStorage = JSON.parse(dataInStorage);

          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setHomePageBanner([]);
          } else {
            setHomePageBanner(bannerShow);
          }
        }

        if (myFaqBanners && myFaqBanners.length > 0) {
          let sort: any = myFaqBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('faqBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setFaqBanner([]);
          } else {
            setFaqBanner(bannerShow);
          }
        }

        if (myProfileBanners && myProfileBanners.length > 0) {
          let sort: any = myProfileBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('profileBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setProfileBanner([]);
          } else {
            setProfileBanner(bannerShow);
          }
        }

        if (myScheduleBanners && myScheduleBanners.length > 0) {
          let sort: any = myScheduleBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('scheduleBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setSchedulePageBanner([]);
          } else {
            setSchedulePageBanner(bannerShow);
          }
        }

        if (myStudentBanners && myStudentBanners.length > 0) {
          let sort: any = myStudentBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('studentBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setStudentBanner([]);
          } else {
            setStudentBanner(bannerShow);
          }
        }

        if (myInboxBanners && myInboxBanners.length > 0) {
          let sort: any = myInboxBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('inboxBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setInboxBanner([]);
          } else {
            setInboxBanner(bannerShow);
          }
        }

        if (myPaymentBanners && myPaymentBanners.length > 0) {
          let sort: any = myPaymentBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('paymentBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setPaymentHistoryBanner([]);
          } else {
            setPaymentHistoryBanner(bannerShow);
          }
        }

        if (myTicketBanners && myTicketBanners.length > 0) {
          let sort: any = myTicketBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('ticketBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setJobTicketBanner([]);
          } else {
            setJobTicketBanner(bannerShow);
          }
        }

        if (myReportBanners && myReportBanners.length > 0) {
          let sort: any = myReportBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('reportBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setReportSubmissionBanner([]);
          } else {
            setReportSubmissionBanner(bannerShow);
          }
        }
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const linkToOtherPage = () => {
    if (homePageBanner.callToActionType == 'Open URL') {
      Linking.openURL(homePageBanner.urlToOpen);
    } else if (homePageBanner.callToActionType == 'Open Page')
      if (homePageBanner.pageToOpen == 'Dashboard') {
        navigation.navigate('Home');
      } else if (homePageBanner.pageToOpen == 'Faq') {
        navigation.navigate('FAQs');
      } else if (homePageBanner.pageToOpen == 'Class Schedule List') {
        navigation.navigate('Schedule');
      } else if (homePageBanner.pageToOpen == 'Student List') {
        navigation.navigate('Students');
      } else if (homePageBanner.pageToOpen == 'Inbox') {
        navigation.navigate('inbox');
      } else if (homePageBanner.pageToOpen == 'Profile') {
        navigation.navigate('Profile');
      } else if (homePageBanner.pageToOpen == 'Payment History') {
        navigation.navigate('PaymentHistory');
      } else if (homePageBanner.pageToOpen == 'Job Ticket List') {
        navigation.navigate('Job Ticket');
      } else if (homePageBanner.pageToOpen == 'Submission History') {
        navigation.navigate('ReportSubmissionHistory');
      }
  };

  const closeBannerModal = async () => {
    if (homePageBanner.displayOnce == 'on') {
      let bannerData = { ...homePageBanner };

      let stringData = JSON.stringify(bannerData);

      let data = await AsyncStorage.setItem('homePageBanner', stringData);
      setHomePageBanner([]);
      setOpenPPModal(false);
    } else {
      setOpenPPModal(false);
    }
  };

  function convertTo12HourFormat(time24: string): string {
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

  // let imageUrl = tutorDetails?.tutorImage?.includes('https')
  //   ? tutorDetails.tutorImage
  //   : `${Base_Uri}public/tutorImage/${tutorDetails.tutorImage}`;

  function convertDateFormat(date: string): string {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
  }

  interface LoginAuth {
    status: Number;
    tutorID: Number;
    token: string;
  }

  const [tutorImage, setTutorImage] = useState('');
  const getTutorDetailss = async () => {
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);

    let { tutorID } = loginData;
    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorID}`)
      .then(({ data }) => {
        let { tutorDetailById } = data;
        let tutorDetails = tutorDetailById[0];
        // console.log('tutorDetails', tutorDetails);
        setTutorImage(tutorDetails.tutorImage);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };
  useEffect(() => {
    getTutorDetailss();
  }, [focus, refreshing]);


  const getNotificationScreenName = async () => {
    try {
      let notiRoute: any = await AsyncStorage.getItem('notiScreenRoute');
      if (notiRoute) {
        let notiScreenName = JSON.parse(notiRoute);
        console.log("notiRoute====>", notiScreenName);
      } else {
        console.log("notiRoute is null");
      }
    } catch (error) {
      console.error("Error retrieving notiRoute:", error);
    }
  };

  // Call the function wherever you need it


  useEffect(() => {
    // getFcmToken();
    getNotificationScreenName();
  }, [focus]);

  notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        let screenName = detail?.notification?.data?.sender
        if (screenName == 'jobTicket')
          navigation.replace('Main', {
            screen: 'jobTicket',
          });
        break;
    }
  });


  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS) {
      // Update external API
      let screenName = detail?.notification?.data?.sender
      if (screenName == 'jobTicket')
        navigation.replace('Main', {
          screen: 'jobTicket',
        });
    }
  });
  const [monthYear, setMonthYear] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const getCurrentMonthDates = (monthYear: any) => {
    const currentDate = new Date(monthYear);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthName = monthNames[currentMonth];

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
        isoDate: isoDate,
        month: monthName, // Include the month name here
      });
    }

    return dates;
  };

  const [dashboardData, setDashboardData] = useState<any>([])
  let selectedMonth = getCurrentMonthDates(monthYear)

  const getDashboardData = () => {
    console.log("tutorId", tutorId);

    axios
      .get(`${Base_Uri}api/get_tutor_dashboard_data/${tutorId}/${selectedMonth[0]?.month}`)
      .then(({ data }) => {
        // console.log("getDashboardData===>",data);
        setDashboardData(data)
        // setCumulativeCommission(data.commulativeCommission);
      })
      .catch((error: any) => {
        console.log("error", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log('Server responded with data:', error.response.data);
          console.log('Status code:', error.response.status);
          console.log('Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error setting up the request:', error.message);
        }

        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  }

  useEffect(() => {
    getDashboardData();
  }, [monthYear, focus])



  const showPickerMonthAndYear = useCallback((value: any) => setShowMonthPicker(value), []);
  // console.log("monthYear", monthYear);

  const onValueChangeMonthPicker = useCallback(
    (event: any, newDate: any) => {
      const selectedDate = newDate || monthYear;

      showPickerMonthAndYear(false);
      setMonthYear(selectedDate);
    },
    [monthYear, showPickerMonthAndYear],
  );

  const [modalVisible, setModalVisible] = useState(false);
  const checkTutorStatus = async () => {
    // isVerified = true
    // if(isVerified){
    //   setModalVisible(true)
    // }
    console.log('tutorId', tutorId);

    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorId}`)
      .then(({ data }) => {
        let { tutorDetailById } = data;
        let tutorDetails = tutorDetailById[0];
        if (data.tutorDetailById == null) {
          AsyncStorage.removeItem('loginAuth');
          navigation.replace('Login');
          // setTutorDetail('')
          // ToastAndroid.show('Terminated', ToastAndroid.SHORT);
          Toast.show({
            type: 'info',
            // text1: 'Request timeout:',
            text2: `Terminated`,
            position: 'bottom'
          });
          return;
        }
        let details = {
          full_name: tutorDetails?.full_name,
          email: tutorDetails?.email,
          displayName: tutorDetails?.displayName,
          gender: tutorDetails?.gender,
          phoneNumber: tutorDetails?.phoneNumber,
          age: tutorDetails?.age,
          nric: tutorDetails?.nric,
          tutorImage: tutorDetails?.tutorImage,
          tutorId: tutorDetails?.id,
          status: tutorDetails?.status,
        };
        updateTutorDetails(details);
        if (tutorDetailById[0].status.toLowerCase() == 'verified' && tutorDetailById[0]?.open_dashboard != 'yes') {
          axios
            .get(`${Base_Uri}api/update_dashboard_status/${tutorId}`)
            .then(({ data }) => {
              setModalVisible(true)
            })
            .catch((error: any) => {
              console.log('errror========>', error);
            });
          return;
        }
      })
      .catch(error => {
        // ToastAndroid.show(
        //   'Internal Server Error getTutorDetailByID ',
        //   ToastAndroid.SHORT,
        // );
      });
  };

  const HandelGoToDashboard = () => {
    setModalVisible(false);
    navigation.navigate('Home')
  };

  useEffect(() => {
    const unsubscribe = subscribeToChannel({
      channelName: 'tutor-approved',
      eventName: 'App\\Events\\TutorApproved',
      callback: (data: any) => {
        console.log('Event received:', data);
        checkTutorStatus();
      }
    });

    return unsubscribe;
  }, [focus]);
  return (
    <View style={{ flex: 1, backgroundColor: Theme.GhostWhite }}>
      <CustomLoader visible={!cancelledHours} />
      <CustomLoader visible={refreshing} />
      <View style={{ margin: 30 }}></View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 25,
          paddingBottom: 10,
        }}>
        <View style={{ width: '60%' }}>
          <Text style={styles.textType3}>Welcome Back!</Text>
          <Text
            style={[
              styles.textType1,
              { fontWeight: '700', lineHeight: 30 },
            ]}>
            {tutorDetails?.displayName ?? tutorDetails?.full_name}
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ top: 7 }}
            onPress={() => navigation.navigate('Notifications')}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={28}
              color={Theme.Dune}
            />
            <View
              style={{
                borderRadius: 100,
                backgroundColor: Theme.red,
                width: 15,
                height: 15,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                left: 15,
                top: -26,
              }}>
              <Text
                style={[styles.text, { fontSize: 10, color: Theme.white }]}>
                {notification.length + scheduleNotification.length > 0
                  ? notification.length + scheduleNotification.length
                  : 0}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{
              borderWidth: 2,
              borderRadius: 50,
              borderColor: Theme.Dune,
            }}
            activeOpacity={0.8}>
            <Image
              source={{ uri: tutorImage }}
              style={{ height: 40, width: 40, borderRadius: 50 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{ backgroundColor: Theme.GhostWhite }} />
        }
        style={[styles.container, {}]}
        showsVerticalScrollIndicator={false}>


        {/* unverified banner */}

        {tutorDetails?.status?.toLowerCase() == 'verified' ? null :
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TutorVerificationProcess')}
            style={{ alignItems: 'center', paddingHorizontal: 25,}}>
            <View style={{ margin: 6 }}></View>
            <Image
              source={require('../../Assets/Images/Banner.png')}
              resizeMode="contain"
              style={{ width: Dimensions.get('screen').width / 1.14 }}
            />
          </TouchableOpacity>
        }

        {classInProcess && Object.keys(classInProcess).length > 0 ? (
          <View style={{ backgroundColor: Theme.GhostWhite, paddingHorizontal: 25 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ClassTimerCount', classInProcess)
              }
              activeOpacity={0.8}
              style={{
                backgroundColor: Theme.black,
                paddingVertical: 30,
                paddingHorizontal: 20,
                borderRadius: 30,
                marginVertical: 30,
              }}>
              <View style={{ flexDirection: 'row', gap: 15 }}>
                <Text style={[styles.textType1, { color: Theme.white }]}>
                  Ongoing Classes
                </Text>
                <Text
                  style={[styles.text, { fontSize: 10, color: Theme.white }]}>
                  <ActivityIndicator color={'white'} size="small" />
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 25,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  {classInProcess?.item?.studentGender?.toLowerCase() == 'male' ?
                    <Image source={require('../../Assets/Images/StudentMale.png')} />
                    :
                    <Image source={require('../../Assets/Images/StudentFemale.png')} />

                  }
                  <View style={{ gap: 5 }}>
                    {/* <Text style={[styles.textType3, { color: Theme.white, }]}>J9003560</Text> */}
                    <Text style={[styles.textType1, { color: Theme.white }]}>
                      {classInProcess?.item?.studentName}
                    </Text>
                    <Text style={[styles.textType3, { color: Theme.white }]}>
                      {classInProcess?.item?.subjectName}
                    </Text>
                  </View>
                </View>

                <View>
                  <Image
                    source={require('../../Assets/Images/RightArrow.png')}
                    resizeMode="contain"
                    style={{ width: 25, height: 25 }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          null
        )}
        {tutorDetails?.status?.toLowerCase() == 'verified' ?
          <View style={{ marginVertical: 25, backgroundColor: Theme.GhostWhite, paddingHorizontal: 25 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[styles.textType1, { fontFamily: 'Circular Std Bold' }]}>
                Monthly Summary
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity
                  // onPress={() => showPicker(true)}
                  onPress={() => showPickerMonthAndYear(true)}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: Theme.white,
                    flexDirection: 'row',
                    gap: 15,
                    paddingVertical: 5,
                    alignItems: 'center',
                    borderRadius: 6,
                    paddingHorizontal: 5,
                    paddingLeft: 8,
                    borderWidth: 1,
                    borderColor: Theme.lineColor,
                  }}>
                  <Text style={[styles.textType3]}>
                    {monthYear.toLocaleDateString([], {
                      month: 'short',
                      // year: 'numeric',
                    })}
                  </Text>
                  <Entypo name="chevron-down" size={22} color={Theme.Dune} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ margin: 6 }}></View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{ width: '49%' }}>
                <View
                  style={{
                    backgroundColor: Theme.darkGray,
                    paddingRight: 12,
                    paddingLeft: 20,
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                    borderBottomStartRadius: 15,
                    borderBottomEndRadius: 45,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      // marginVertical: 15,
                      marginTop: 15
                    }}>
                    <DiagArrow color={Theme.white} />
                  </View>
                  <Money />
                  <View style={{ margin: 8 }}></View>
                  <View style={{ paddingBottom: 20 }}>
                    <Text style={[styles.textType3, { color: 'white' }]}>
                      Earnings
                    </Text>
                    <View style={{ margin: 2 }}></View>
                    <Text
                      style={[
                        styles.textType1,
                        { color: 'white', fontSize: 30, lineHeight: 40 },
                      ]}>
                      {/* RM {cummulativeCommission && cummulativeCommission} */}
                      RM {dashboardData?.cumulativeCommission}
                      {/* RM 2150 */}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: Theme.white,
                    paddingHorizontal: 15,
                    marginTop: 10,
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                    borderBottomStartRadius: 30,
                    borderBottomEndRadius: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                      marginTop: 15,
                    }}>
                    <Text style={styles.textType3}>Active Student</Text>
                    <DiagArrow />
                  </View>
                  <View style={{ margin: 1 }}></View>
                  <View
                    style={{
                      paddingBottom: 20,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.textType1,
                        { fontSize: 30, lineHeight: 38 },
                      ]}>
                      {students?.length ? students?.length : '0'}
                    </Text>
                    <Student />
                  </View>
                </View>
              </View>
              <View style={{ width: '49%' }}>
                <View
                  style={{
                    backgroundColor: Theme.white,
                    paddingHorizontal: 15,
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                    borderBottomStartRadius: 45,
                    borderBottomEndRadius: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 20,
                    }}>
                    <Clock />
                    <DiagArrow />
                  </View>
                  <View style={{ paddingBottom: 20 }}>
                    <Text style={[styles.textType3]}>Attended Hours</Text>
                    <Text
                      style={[
                        styles.textType1,
                        { fontSize: 30, lineHeight: 40 },
                      ]}>
                      {/* {attendedHours && attendedHours} */}
                      {dashboardData?.attendedHours}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: Theme.white,
                    paddingHorizontal: 15,
                    marginTop: 10,
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                    borderBottomStartRadius: 30,
                    borderBottomEndRadius: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 16,
                    }}>
                    <Schedule />
                    <DiagArrow />
                  </View>
                  <View style={{ paddingBottom: 20 }}>
                    <Text style={[styles.textType3]}>Scheduled Hours</Text>
                    <Text
                      style={[
                        styles.textType1,
                        { fontSize: 30, lineHeight: 40 },
                      ]}>
                      {/* {schedulesHours && schedulesHours} */}
                      {dashboardData?.scheduledHours}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          : null
        }
        <View style={{ margin: tutorDetails?.status?.toLowerCase() == 'verified' ? 0 : 16 }}></View>

        {jobTicketData && jobTicketData?.length > 0 ?
          <View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                // marginHorizontal: 10,
                paddingHorizontal: 25
              }}>
              <Text style={[styles.textType1, { fontFamily: 'Circular Std Bold' }]}>
                Job Tickets
              </Text>
              <TouchableOpacity onPress={() => navigation.replace('Main', {
                screen: 'jobTicket',
              })}>
                <Text
                  style={[
                    styles.textType3,
                    { color: Theme.BrightBlue, fontFamily: 'Circular Std Book' },
                  ]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ margin: 3 }}></View>
            <View style={{ paddingHorizontal: 22 }}>
              <JobTicketCarousel jobTicketData={jobTicketData} navigation={navigation} />
            </View>
          </View>
          : null
        }
        <View style={{ margin: 8 }}></View>
        {tutorDetails?.status?.toLowerCase() == 'verified' ? null :
          <View style={{ marginTop: 30, marginBottom: 0, paddingHorizontal: 25 }}>
            <Text
              style={[
                styles.textType3,
                { textAlign: 'center', lineHeight: 20, marginBottom: 15 },
              ]}>
              Verify your profile to qualify for tutoring jobs. Tap Verify Now to proceed.
            </Text>
            <CustomButton btnTitle="Verify Now" onPress={() => navigation.navigate('TutorVerificationProcess')} />
          </View>
        }
        {tutorDetails?.status?.toLowerCase() == 'verified' &&
          <View style={{ paddingHorizontal: 25 }}>
            <View style={{ margin: 8 }}></View>
            <View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                <Text style={[styles.textType1, { fontFamily: 'Circular Std Bold' }]}>
                  Upcoming Classes
                </Text>
              </View>
              <View style={{ margin: 3 }}></View>
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
          </View>
        }
        {latestNewsData && latestNewsData?.length > 0 ? (
          <>
            <View style={{ margin: 8 }}></View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                // marginHorizontal: 10,
                marginTop: 15,
                paddingHorizontal: 25
              }}>
              <Text style={[styles.textType1]}>Latest News</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Main', {
                  screen: 'inbox',
                })}
              >
                <Text
                  style={[
                    styles.textType3,
                    { color: Theme.BrightBlue, fontFamily: 'Circular Std Book' },
                  ]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ margin: 2 }}></View>

            <View style={{ paddingHorizontal: 25 }}>
              <LatestNews latestNewsData={latestNewsData} navigation={navigation} />
            </View>
          </>
        ) : null}

        <BackToDashboard
          modalVisible={modalVisible}
          handleGoToDashboard={() => HandelGoToDashboard()}
        />

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

      </ScrollView>
      {openPPModal &&
        Object.keys(homePageBanner).length > 0 &&
        (homePageBanner.tutorStatusCriteria == 'All' ||
          tutorDetails.status == 'verified') && (
          <View style={{ flex: 1 }}>
            <Modal
              visible={openPPModal}
              style={{ flex: 1 }}
              animationType="fade"
              transparent={true}
              onRequestClose={() => closeBannerModal()}>
              <TouchableOpacity
                onPress={() => linkToOtherPage()}
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}>
                  <TouchableOpacity onPress={() => closeBannerModal()}>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        paddingVertical: 10,
                        paddingRight: 15,
                      }}>
                      <AntDesign
                        name="closecircleo"
                        size={20}
                        color={Theme.Dune}
                      />
                    </View>
                  </TouchableOpacity>
                  {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                  <Image
                    source={{ uri: homePageBanner.bannerImage }}
                    style={{
                      width: Dimensions.get('screen').width / 1,
                      height: '90%',
                    }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.GhostWhite,


  },
  text: {
    color: Theme.Dune,
    fontSize: 22,
  },
  heading: {
    color: Theme.Dune,
    fontSize: 22,
    fontWeight: '500',
  },
  firstBox: {
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: Theme.darkGray,
    borderRadius: 6,
    marginTop: 15,
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
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Circular Std',
    fontStyle: 'normal',
  },
  modalContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

// <TouchableOpacity
//   activeOpacity={0.8}
//   onPress={() => navigation.navigate('Notifications')}
//   style={[
//     styles.firstBox,
//     {
//       backgroundColor: Theme.white,
//       justifyContent: 'space-between',
//       paddingHorizontal: 20,
//       flexDirection: 'row',
//       marginTop: 15,
//     },
//   ]}>
//   <Text style={[styles.text, { color: Theme.black, fontSize: 16 }]}>
//     Notifications
//   </Text>
//   <View
//     style={{
//       borderRadius: 100,
//       backgroundColor: Theme.red,
//       width: 25,
//       height: 25,
//       alignItems: 'center',
//       justifyContent: 'center',
//     }}>
//     <Text style={[styles.text, { fontSize: 10, color: Theme.white }]}>
//       {notification.length + scheduleNotification.length > 0
//         ? notification.length + scheduleNotification.length
//         : 0}
//     </Text>
//   </View>
// </TouchableOpacity>

{
  /* <TouchableOpacity
              onPress={() =>
                navigation.navigate('ClassTimerCount', classInProcess)
              }
              style={[
                styles.firstBox,
                {
                  backgroundColor: Theme.white,
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  flexDirection: 'row',
                  marginTop: 10,
                },
              ]}>
              <Text style={[styles.text, { color: Theme.black, fontSize: 12 }]}>
                You have ongoing class
              </Text>
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: 'white',
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={[styles.text, { fontSize: 10, color: Theme.white }]}>
                  <ActivityIndicator color={'blue'} size="small" />
                </Text>
              </View>
            </TouchableOpacity> */
}
