import {StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import AppNavigation from './Navigation/AppNavigation';
import TutorDetailsState from './context/tutorDetailsState';
import UpcomingClassState from './context/upcomingClassState';
import BannerState from './context/bannerState';
import NoteState from './context/noteState';
import ReportSubmissionState from './context/reportSubmissionState';
import ScheduleState from './context/ScheduleState';
import NotificationState from './context/notificationState';
import ScheduleNotificationState from './context/scheduleNotificationState';
import PaymentState from './context/paymentState';
import StudentState from './context/studentState';
import FilterState from './context/filterState';
import IdleTimerManager from 'react-native-idle-timer';
import { getFcmToken, registerListenerWithFCM } from './src/utils/fcmHelper';
const App = () => {
  useEffect(() => {
    IdleTimerManager.setIdleTimerDisabled(true);

    return () => IdleTimerManager.setIdleTimerDisabled(false);
  }, []);
  useEffect(() => {
    getFcmToken();
  }, []);

  useEffect(() => {
    const unsubscribe = registerListenerWithFCM();
    return unsubscribe;
  }, []);
  return (
    <UpcomingClassState>
    <BannerState>
      <NoteState>
        <ReportSubmissionState>
          <ScheduleState>
            <NotificationState>
              <ScheduleNotificationState>
                <PaymentState>
                  <TutorDetailsState>
                    <StudentState>
                      <FilterState>
                        <AppNavigation />
                        {/* <Timer show="false" /> */}
                      </FilterState>
                    </StudentState>
                  </TutorDetailsState>
                </PaymentState>
              </ScheduleNotificationState>
            </NotificationState>
          </ScheduleState>
        </ReportSubmissionState>
      </NoteState>
    </BannerState>
  </UpcomingClassState>
  );
};

export default App;

const styles = StyleSheet.create({});
