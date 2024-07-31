import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';

const TutorlaTermOfServices = ({ navigation }: any) => {
  return (
    <View
      style={{
        backgroundColor: Theme.GhostWhite,
        height: '100%',
        
      }}>
        <Header title={'Term of Services'} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 25, marginBottom: 0 }}>
          <View style={{ margin: 0 }}></View>
          <View
            style={{
              backgroundColor: Theme.white,
              padding: 25,
              borderRadius: 20,
            }}>
            <Text
              style={[
                styles.textType3,
                { color: Theme.IronsideGrey, lineHeight: 22 },
              ]}>
              These Terms of Use (“Terms”) govern your use of the Tutorla
              website (“Site”) at www.sifututor.my, any mobile device
              application or any other means provided or authorised by Tutor Edu
              & Learning Sdn Bhd (“SIFUTUTOR”). Please read these Terms before
              using or continuing to use the Site.
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Theme.white,
              padding: 25,
              borderRadius: 20,
              marginVertical: 15,
            }}>
            <Text
              style={[
                styles.textType1,
                { color: Theme.Black, fontSize: 20, marginBottom: 15 },
              ]}>
              1. General Terms
            </Text>
            <Text
              style={[
                styles.textType3,
                { color: Theme.IronsideGrey, lineHeight: 22 },
              ]}>
              SIFUTUTOR provides this Site to Users seeking tutoring services
              (“Students”) and to Users seeking to provide tutoring services
              (“Tutors”), and to any other entity on whose behalf Users accept
              these Terms entity who views, uses, accesses, or browses any
              content and/or creates, uploads, posts, sends, receives or stores
              content to the Site.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginVertical: 15, }}>
              <View style={{ position: "relative", top: 8 }}>
                <AntDesign name='checkcircle' size={22} color={Theme.Primary} />
              </View>
              <Text
                style={[
                  styles.textType3,
                  { color: Theme.IronsideGrey, lineHeight: 22, width: '90%' },
                ]}>
                To the extent that an associated with the Site in conflict inconsistent with Terms, the Terms shall control.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
              <View style={{ position: "relative", top: 8 }}>
                <AntDesign name='checkcircle' size={22} color={Theme.Primary} />
              </View>
              <Text
                style={[
                  styles.textType3,
                  { color: Theme.IronsideGrey, lineHeight: 22, width: '90%' },
                ]}>
                If any provision of the Terms is held invalid by any law or regulation any court or arbitrator.
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: Theme.white,
              padding: 25,
              borderRadius: 20,
              marginVertical: 15,
            }}>
            <Text
              style={[
                styles.textType1,
                { color: Theme.Black, fontSize: 20, marginBottom: 15 },
              ]}>
              2. Privacy Policy
            </Text>
            <Text
              style={[
                styles.textType3,
                { color: Theme.IronsideGrey, lineHeight: 22 },
              ]}>
              Please refer to the SIFUTUTOR Privacy Policy at for information on SIFUTUTOR collects, uses and discloses information about you.
            </Text>
          </View>
        </View>
        <View style={{ margin: 20 }}></View>
      </ScrollView>
    </View>
  );
};

export default TutorlaTermOfServices;

const styles = StyleSheet.create({
  textType3: {
    color: Theme.Dune,
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Circular Std Book',
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
});
