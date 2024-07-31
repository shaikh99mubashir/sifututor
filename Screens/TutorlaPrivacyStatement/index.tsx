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

const TutorlaPrivacyStatement = ({ navigation }: any) => {
  return (
    <View
      style={{
        backgroundColor: Theme.GhostWhite,
        height: '100%',
      }}>
      <Header title={'Privacy Policy'} BackBtn navigation={navigation} />
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
              Our goal is to provide yo with a positive experience our websites
              and when using our products and services, while the same time keep
              your Personal Info as defined below, secure.
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
              Types of Information Covered by This Privacy Policy
            </Text>
            <Text
              style={[
                styles.textType3,
                { color: Theme.IronsideGrey, lineHeight: 22 },
              ]}>
              SIFUTUTOR Personal Information people who browse our webpage or purchase products from our webpage. Personal Information means any information that can be used to identify you or that relates to you.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginVertical: 15 }}>
              <View style={{ position: 'relative', top: 8 }}>
                <AntDesign name="checkcircle" size={22} color={Theme.Primary} />
              </View>
              <Text
                style={[
                  styles.textType3,
                  { color: Theme.IronsideGrey, lineHeight: 22, width: '90%' },
                ]}>
                Usage data relating to SIFUTUTOR Websites and SIFUTUTOR Products Language preferences SIFUTUTOR website page views
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
              <View style={{ position: 'relative', top: 8 }}>
                <AntDesign name="checkcircle" size={22} color={Theme.Primary} />
              </View>
              <Text
                style={[
                  styles.textType3,
                  { color: Theme.IronsideGrey, lineHeight: 22, width: '90%' },
                ]}>
                Comments you post about our products
              </Text>
            </View>
            <Text
              style={[
                styles.textType3,
                { color: Theme.IronsideGrey, lineHeight: 22 },
              ]}>
              Information may be aggregated and/or anonymised information is aggregated is combined information about other customers an users. Aggregated inform that include Personal Inform considered Personal Information until it has been anonymised.
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
              How We Collect Information
            </Text>
            <Text
              style={[
                styles.textType3,
                { color: Theme.IronsideGrey, lineHeight: 22 },
              ]}>
              We may collect & process the following data about you:
            </Text>
          </View>
        </View>
        <View style={{ margin: 20 }}></View>
      </ScrollView>
    </View>
  );
};

export default TutorlaPrivacyStatement;

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
