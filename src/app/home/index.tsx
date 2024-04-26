import { useState, useEffect, useId, useRef } from 'react';
import { View, TouchableOpacity, Alert, SectionList, Text } from 'react-native';

import { styles } from './styles';
import { theme } from '@/theme';

import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';

import { Contact, ContactProps } from '@/components/contact';
import * as Contacts from 'expo-contacts';
import { Avatar } from '@/components/avatar';

type SectionListDataProps = {
    title: string,
    data: ContactProps[],
};

export function Home(){
    
    const [name, setName] = useState('');
    const [contacts, setContacts] = useState<SectionListDataProps[]>([]);
    const [contact, setContact] = useState<Contacts.Contact>();

    const bottomSheetRef = useRef<BottomSheet>(null);

    //Gesto de abrir a janela inferior
    const handleBottomSheetOpen = () => bottomSheetRef.current?.expand();

    //Gesto de fechar a janela inferior
    const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0);

    //Função para abrir os detalhes ao clicar em um contato
    async function handleOpenDetails(id: string){
        const response = await Contacts.getContactByIdAsync(id);
        setContact(response);
        
        handleBottomSheetOpen();
    }
    
    //Recuperando contatos
    async function fetchContacts() {
        try {

            //requerendo permissão para acessar os contatos
            const { status } = await Contacts.requestPermissionsAsync();

            if(status === Contacts.PermissionStatus.GRANTED){

                const { data } = await Contacts.getContactsAsync({
                    sort: 'firstName',
                    name: name,
                });
                
                const list = data.map((contact) => ({
                    id: contact.id ?? useId(),
                    name: contact.name,
                    image: contact.image,
                })).reduce<SectionListDataProps[]>((acc: any, item) => {
                    
                    const firstLetter = item.name[0].toUpperCase();

                    const existingEntry = acc.find((entry: SectionListDataProps) => entry.title === firstLetter);

                    if(existingEntry){
                        existingEntry.data.push(item);
                    }
                    else{
                        acc.push({title: firstLetter, data: [item]});
                    }

                    return acc;
                }, []);

                setContacts(list);
                setContact(data[0]);
            }
            
        } 
        catch (error) {
            
            console.log(error);
            Alert.alert('Contatos', 'Erro ao carregar contatos');
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [name]);

    return(
        <View style={styles.container}>
            
            {/* Cabeçalho */}
            <View style={styles.header}>
                <Input style={styles.input}> 
                    <Feather name='search' size={16} color={theme.colors.gray_300}/>
                    
                    <Input.Field placeholder='Pesquisar pelo nome' onChangeText={setName} value={name}/>

                    <TouchableOpacity onPress={() => setName("")} activeOpacity={0.7}>
                        <Feather name='x' size={16} color={theme.colors.gray_300}/>
                    </TouchableOpacity>
                </Input>
            </View>

            {/* Lista de Contatos */}
            <SectionList 
                sections={contacts} 
                keyExtractor={item => item.id}
                
                renderItem={({item}) => <Contact contact={item} onPress={() => handleOpenDetails(item.id)}/>}
                
                renderSectionHeader={({ section }) => <Text style={styles.section}>{section.title}</Text>}
                contentContainerStyle={styles.contentList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            />

            { contact &&
                <BottomSheet 
                    ref={bottomSheetRef} 
                    snapPoints={[0.01, 284]} 
                    handleComponent={()=> null}
                    backgroundStyle={styles.bottomSheet}
                >
                    <Avatar name={contact.name} image={contact.image} variant='large' containerStyle={styles.image}/>
                    <View style={styles.bottomSheetContent}>
                        <Text style={styles.contactName}>{contact.name}</Text>

                        { contact.phoneNumbers &&
                            <View style={styles.phoneNumber}>
                                <Feather name='phone' size={18} color={theme.colors.gray_400}/>
                                <Text style={styles.phone}>{contact.phoneNumbers[0].number}</Text>
                            </View>
                        }

                        <Button title='Fechar' onPress={handleBottomSheetClose}/>
                    </View>
                </BottomSheet>
            }
            
        </View>
    );
}