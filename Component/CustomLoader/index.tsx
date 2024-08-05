import { Image, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CustomLoader = ({ visible }: any) => {
  return (
    <>
      {visible == true ?
        <Modal visible={visible} animationType="fade" transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,1)',
            }}>
            <Image
              source={require('../../Assets/Images/SIFU.gif')}
              style={{ width: 150, height: 150 }}
            />
          </View>
        </Modal>
      :null}
    </>
  )
}

export default CustomLoader

const styles = StyleSheet.create({})