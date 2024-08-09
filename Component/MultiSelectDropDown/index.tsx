import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import { Theme } from '../../constant/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';


const MultiSelectDropDown = (props: any) => {
    let {
        ddTitle,
        categoryData,
        dataShow,
        searchData,
        searchFunc,
        subject,
        search,
        headingStyle,
        categoryShow,
        dropdownPlace,
        dropdownContainerStyle,
        setSelectedSubject,
        selectedSubject,
        ddTextStyle,
        searchCategoryData,
        serviceDD,
        handleDropdownToggle,
    } = props;

    const [selectedServicedata, setSelectedServicedata] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState<string>(''); // Add this state

    const toggleSelectedService = (item: any) => {
        setSelectedServicedata(prevState => {
            const isSelected = prevState.some(selected => selected.subject === item.subject);
            const newSelectedItems = isSelected
                ? prevState.filter(selected => selected.subject !== item.subject)
                : [...prevState, item];

            setSelectedSubject(newSelectedItems);
            return newSelectedItems;
        });
    };

    const filterSearchData = (text: string) => {
        setSearchInput(text);  // Update search input state
        if (text.length > 0) {
            searchFunc(text, search);
        }
    };
    const closeDropdown = () => {
        if (serviceDD) {
            handleDropdownToggle(); // Close dropdown
        }
    };
    return (
        <TouchableWithoutFeedback onPress={closeDropdown}>
        <View>
            <View style={{ borderRadius: 12, overflow: 'hidden', marginVertical: 5 }}>
                {ddTitle && (
                    <Text
                        style={{
                            fontFamily: 'Circular Std Medium',
                            color: Theme.gray,
                            fontSize: 16,
                            marginVertical: 5,
                            textTransform: 'capitalize',
                            marginHorizontal: 5,
                            ...headingStyle,
                        }}>
                        {ddTitle}
                    </Text>
                )}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        handleDropdownToggle(); // Handle dropdown toggle
                        if (serviceDD) {
                            setSearchInput(''); // Reset search input when closing dropdown
                        }
                    }}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderWidth: 0,
                        backgroundColor: Theme.white,
                        borderRadius: 15,
                        height: 60,
                        borderColor: Theme.gray,
                        alignItems: 'center',
                        ...dropdownContainerStyle,
                    }}>
                    <Text
                        style={{
                            color: Theme.gray,
                            fontFamily: 'Circular Std Medium',
                            fontSize: 16,
                            textTransform: 'capitalize',
                        }}>
                        {selectedServicedata.length > 0
                            ? selectedServicedata.map(item => item.subject).join(', ')
                            : dropdownPlace ?? ddTitle}
                    </Text>
                    {serviceDD ? (
                        <AntDesign name="up" size={20} color={'black'} />
                    ) : (
                        <AntDesign name="down" size={20} color={'black'} />
                    )}
                </TouchableOpacity>
            </View>
            {subject && serviceDD && (
                <View
                    style={{
                        borderRadius: 15,
                        borderColor: Theme.gray,
                        marginVertical: 5,
                        backgroundColor: Theme.white,
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                    }}>
                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled={true}>
                        {search && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: Theme.white,
                                    borderTopRightRadius: 10,
                                    borderTopLeftRadius: 10,
                                }}>
                                <AntDesign
                                    name="search1"
                                    size={18}
                                    color={Theme.IronsideGrey}
                                    style={{ paddingHorizontal: 5 }}
                                />
                                <TextInput
                                    onChangeText={(e) => filterSearchData(e)}
                                    value={searchInput}  // Bind the input value to state
                                    style={{
                                        paddingHorizontal: 10,
                                        marginVertical: 0,
                                        color: 'black',
                                        backgroundColor: Theme.white,
                                        height: 38,
                                        fontFamily: 'Circular Std Medium',
                                        borderTopRightRadius: 10,
                                        borderTopLeftRadius: 10,
                                    }}
                                    placeholder="Search"
                                    placeholderTextColor={Theme.IronsideGrey}
                                />
                            </View>
                        )}
                        {searchData && searchData.length > 0
                            ? Array.from(
                                new Set(searchData.map((item: any) => item?.subject)),
                            ).map((e: any, i: number) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() =>
                                            toggleSelectedService(
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
                                            justifyContent: 'space-between'
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Circular Std Medium',
                                                fontSize: 16,
                                                textTransform: 'capitalize',
                                                color: Theme.Dune,
                                            }}>
                                            {e}
                                        </Text>
                                        <Entypo
                                            name={selectedServicedata.some(
                                                selected => selected.subject === e) ? "check" : ""}
                                            color={Theme.Dune}
                                            size={18}
                                        />
                                    </TouchableOpacity>
                                );
                            })
                            : Array.from(
                                new Set(subject.map((item: any) => item?.subject)),
                            )
                                .slice(0, dataShow || 5)
                                .map((e: any, i: number) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() =>
                                                toggleSelectedService(
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
                                                justifyContent: 'space-between'
                                            }}>
                                            <Text
                                                style={{
                                                    fontFamily: 'Circular Std Medium',
                                                    fontSize: 16,
                                                    textTransform: ddTextStyle
                                                        ? ddTextStyle
                                                        : 'capitalize',
                                                }}>
                                                {e}
                                            </Text>
                                            <Entypo
                                                name={selectedServicedata.some(
                                                    selected => selected.subject === e) ? "check" : ""}
                                                color={Theme.Dune}
                                                size={18}
                                            />
                                        </TouchableOpacity>
                                    );
                                })}
                    </ScrollView>
                </View>
            )}
        </View>
        </TouchableWithoutFeedback>
    );
};

export default MultiSelectDropDown;


// const MultiSelectDropDown = (props: any) => {
//     let {
//         ddTitle,
//         categoryData,
//         dataShow,
//         searchData,
//         searchFunc,
//         subject,
//         search,
//         headingStyle,
//         categoryShow,
//         dropdownPlace,
//         dropdownContainerStyle,
//         setSelectedSubject,
//         selectedSubject,
//         ddTextStyle,
//         searchCategoryData,
//     } = props;

//     const [selectedServicedata, setSelectedServicedata] = useState<any[]>([]);
//     const [serviceDD, setServiceDD] = useState(false);

//     const toggleSelectedService = (item: any) => {
//         setSelectedServicedata(prevState => {
//           const isSelected = prevState.some(selected => selected.subject === item.subject);
//           const newSelectedItems = isSelected 
//             ? prevState.filter(selected => selected.subject !== item.subject)
//             : [...prevState, item];
      
//           setSelectedSubject(newSelectedItems);
//           return newSelectedItems;
//         });
//       };

//     const filterSearchData = (text: string) => {
//         if (text.length > 0) {
//             searchFunc(text, search);
//         }
//     };

//     return (
//         <View>
//             <View style={{ borderRadius: 12, overflow: 'hidden', marginVertical: 5 }}>
//                 {ddTitle && (
//                     <Text
//                         style={{
//                             fontFamily: 'Circular Std Medium',
//                             color: Theme.gray,
//                             fontSize: 16,
//                             marginVertical: 5,
//                             textTransform: 'capitalize',
//                             marginHorizontal: 5,
//                             ...headingStyle,
//                         }}>
//                         {ddTitle}
//                     </Text>
//                 )}
//                 <TouchableOpacity
//                     activeOpacity={0.8}
//                     onPress={() => setServiceDD(!serviceDD)}
//                     style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         paddingVertical: 10,
//                         paddingHorizontal: 20,
//                         borderWidth: 0,
//                         backgroundColor: Theme.white,
//                         borderRadius: 15,
//                         height: 60,
//                         borderColor: Theme.gray,
//                         alignItems: 'center',
//                         ...dropdownContainerStyle,
//                     }}>
//                     <Text
//                         style={{
//                             color: Theme.gray,
//                             fontFamily: 'Circular Std Medium',
//                             fontSize: 16,
//                             textTransform: 'capitalize',
//                         }}>
//                         {selectedServicedata.length > 0
//                             ? selectedServicedata.map(item => item.subject).join(', ')
//                             : dropdownPlace ?? ddTitle}
//                     </Text>
//                     {serviceDD ? (
//                         <AntDesign name="up" size={20} color={'black'} />
//                     ) : (
//                         <AntDesign name="down" size={20} color={'black'} />
//                     )}
//                 </TouchableOpacity>
//             </View>
//             {subject && serviceDD && (
//                 <View
//                     style={{
//                         borderRadius: 15,
//                         borderColor: Theme.gray,
//                         marginVertical: 5,
//                         backgroundColor: Theme.white,
//                         paddingVertical: 15,
//                         paddingHorizontal: 10,
//                     }}>
//                     <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled={true}>
//                         {search && (
//                             <View
//                                 style={{
//                                     flexDirection: 'row',
//                                     alignItems: 'center',
//                                     backgroundColor: Theme.white,
//                                     borderTopRightRadius: 10,
//                                     borderTopLeftRadius: 10,
//                                 }}>
//                                 <AntDesign
//                                     name="search1"
//                                     size={18}
//                                     color={Theme.IronsideGrey}
//                                     style={{ paddingHorizontal: 5 }}
//                                 />
//                                 <TextInput
//                                     onChangeText={(e) => filterSearchData(e)}
//                                     style={{
//                                         paddingHorizontal: 10,
//                                         marginVertical: 0,
//                                         color: 'black',
//                                         backgroundColor: Theme.white,
//                                         height: 38,
//                                         fontFamily: 'Circular Std Medium',
//                                         borderTopRightRadius: 10,
//                                         borderTopLeftRadius: 10,
//                                     }}
//                                     placeholder={'Search'}
//                                     placeholderTextColor={Theme.IronsideGrey}
//                                 />
//                             </View>
//                         )}
//                         {searchData && searchData.length > 0
//                             ? Array.from(
//                                 new Set(searchData.map((item: any) => item?.subject)),
//                             ).map((e: any, i: number) => {
//                                 return (
//                                     <TouchableOpacity
//                                         onPress={() =>
//                                             toggleSelectedService(
//                                                 subject.find(
//                                                     (item: any) => `${item?.subject}` === e,
//                                                 ),
//                                             )
//                                         }
//                                         key={i}
//                                         style={{
//                                             flexDirection: 'row',
//                                             paddingHorizontal: 10,
//                                             marginVertical: 5,
//                                             gap: 10,
//                                             // backgroundColor: selectedServicedata.some(
//                                             //     selected => selected.subject === e,
//                                             // )
//                                             //     ? Theme.gray
//                                             //     : Theme.white,
//                                                 justifyContent:'space-between'
//                                         }}>
//                                         <Text
//                                             style={{
//                                                 fontFamily: 'Circular Std Medium',
//                                                 fontSize: 16,
//                                                 textTransform: 'capitalize',
//                                                 color: Theme.Dune,
//                                                 // color: selectedServicedata.some(
//                                                 //     selected => selected.subject === e,
//                                                 // )
//                                                 //     ? Theme.white
//                                                 //     : Theme.black,
//                                             }}>
//                                             {e}
//                                         </Text>
//                                         <Entypo
//                                             name={selectedServicedata.some(
//                                                 selected => selected.subject === e) ? "check" : ""}
//                                             color={Theme.Dune}
//                                             size={18}
//                                         />
//                                     </TouchableOpacity>
//                                 );
//                             })
//                             : Array.from(
//                                 new Set(subject.map((item: any) => item?.subject)),
//                             )
//                                 .slice(0, dataShow || 5)
//                                 .map((e: any, i: number) => {
//                                     return (
//                                         <TouchableOpacity
//                                             onPress={() =>
//                                                 toggleSelectedService(
//                                                     subject.find(
//                                                         (item: any) => `${item?.subject}` === e,
//                                                     ),
//                                                 )
//                                             }
//                                             key={i}
//                                             style={{
//                                                 flexDirection: 'row',
//                                                 paddingHorizontal: 10,
//                                                 marginVertical: 5,
//                                                 gap: 10,
//                                                 justifyContent:'space-between'
//                                                 // backgroundColor: selectedServicedata.some(
//                                                 //     selected => selected.subject === e,
//                                                 // )
//                                                 //     ? Theme.gray
//                                                 //     : Theme.white,
//                                             }}>
//                                             <Text
//                                                 style={{
//                                                     fontFamily: 'Circular Std Medium',
//                                                     fontSize: 16,
//                                                     textTransform: ddTextStyle
//                                                         ? ddTextStyle
//                                                         : 'capitalize',
//                                                     // color: selectedServicedata.some(
//                                                     //     selected => selected.subject === e,
//                                                     // )
//                                                     //     ? Theme.white
//                                                     //     : Theme.black,
//                                                 }}>
//                                                 {e}
//                                             </Text>
//                                             <Entypo
//                                             name={selectedServicedata.some(
//                                                 selected => selected.subject === e) ? "check" : ""}
//                                             color={Theme.Dune}
//                                             size={18}
//                                         />
//                                         </TouchableOpacity>
//                                     );
//                                 })}
//                     </ScrollView>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default MultiSelectDropDown;

const styles = StyleSheet.create({});
