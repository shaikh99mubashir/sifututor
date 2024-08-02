import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';

const FAQs = ({navigation}: any) => {
  const [faqsData, setFaqsData]: any = useState<any>([
    {
      id: '1',
      question:
        'What are the Criteria needed to be selected when applying for job tickets?',
      description:
        'First and foremost, you must meet the eligibility criteria specified by the job provider.',
      open: false,
    },
    {
      id: '2',
      question: 'What are the Requirements to become a tutor-Partner?',
      description:
        'First and foremost, you must meet the eligibility criteria specified by the job provider.',
      open: false,
    },
    {
      id: '3',
      question:
        'I have applied for a few job tickets, but they are still pending. May l know why?',
      description:
        'First and foremost, you must meet the eligibility criteria specified by the job provider.',
      open: false,
    },
    {
      id: '4',
      question:
        'Who may l refer to regarding my application’s status as a Tutor-Partner?',
      description:
        'First and foremost, you must meet the eligibility criteria specified by the job provider.',
      open: false,
    },
    {
      id: '5',
      question: 'Can l apply for more than one job ticket?',
      description:
        'First and foremost, you must meet the eligibility criteria specified by the job provider.',
      open: false,
    },
    {
      id: '6',
      question:
        'What’s next if my Tutorla application is accepted? Do l need to fill out forms or prepare any documentation?',
      description:
        'First and foremost, you must meet the eligibility criteria specified by the job provider.',
      open: false,
    },
  ]);

  const handleQuestionPress = (index: number) => {
    setFaqsData((prevData: any) =>
      prevData.map((faq: any, i: number) => ({
        ...faq,
        open: i === index ? !faq.open : false,
      })),
    );
  };

  const renderFAQItem = ({item, index}: any) => (
    <View style={{marginBottom: 20}}>
      <TouchableOpacity
        onPress={() => handleQuestionPress(index)}
        activeOpacity={0.8}
        style={{
          backgroundColor: Theme.white,
          padding: 20,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{width: '90%'}}>
          <Text style={[styles.textType3, {fontSize: 14}]}>
            {item.question}
          </Text>
        </View>
        <View style={{marginLeft: 10}}>
          <Entypo
            name={item.open ? 'minus' : 'plus'}
            size={18}
            color={Theme.Black}
          />
        </View>
      </TouchableOpacity>
      {item.open && (
        <Text
          style={[
            styles.textType3,
            {
              fontSize: 14,
              fontFamily: 'Circular Std Book',
              color: Theme.IronsideGrey,
              paddingHorizontal: 20,
              paddingVertical: 10,
            },
          ]}>
          {item.description}
        </Text>
      )}
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: Theme.GhostWhite,
        height: '100%',
        
      }}>
      <Header backBtn title="FAQs" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled style={{paddingHorizontal: 25,}}>
        <View style={{margin: 10}}></View>
        <Text style={[styles.textType3, {textAlign: 'center'}]}>
          What do you want to know?
        </Text>
        <View style={{margin: 8}}></View>
        <Text
          style={[
            styles.textType1,
            {textAlign: 'center', fontFamily: 'Circular Std Bold',lineHeight:26,fontWeight:700},
          ]}>
          Some of the most Frequently Asked Questions
        </Text>
        <View style={{margin: 15}}></View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={[styles.textType1,{lineHeight:26}]}>Application & {'\n'}Registration</Text>
          <Image source={require('../../Assets/Images/faq1.png')} style={{right:25}}/>
        </View>
        <View style={{margin: 15}}></View>

        <View>
          <FlatList
            data={faqsData}
            renderItem={renderFAQItem}
            keyExtractor={item => item.id}
          />
        </View>

        <View style={{margin: 15}}></View>
        <View style={{flexDirection:'row', alignItems:'flex-end'}}>
          <Image source={require('../../Assets/Images/FaqPayment.png')} />
          <Text style={[styles.textType1,{lineHeight:26,paddingBottom:25}]}>Payments</Text>
        </View>

        <View style={{margin: 15}}></View>

        <View>
          <FlatList
            data={faqsData}
            renderItem={renderFAQItem}
            keyExtractor={item => item.id}
          />
        </View>

        <View style={{margin: 15}}></View>
        <View style={{flexDirection:'row', alignItems:'flex-end',justifyContent:'space-between'}}>
          <Text style={[styles.textType1,{lineHeight:26,paddingBottom:15,left:30}]}>Others</Text>
          <Image source={require('../../Assets/Images/Other.png')} />
        </View>
        <View style={{margin: 15}}></View>
        <View>
          <FlatList
            data={faqsData}
            renderItem={renderFAQItem}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={{margin:20}}></View>
      </ScrollView>
    </View>
  );
};

export default FAQs;

const styles = StyleSheet.create({
  textType3: {
    color: Theme.Dune,
    // fontWeight: '500',
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
});