
import { theme } from '@/theme';
import {styles} from './styles';
import { View, ViewProps, TextInput, TextInputProps } from 'react-native';


function Input({ children, style }: ViewProps){
    return(
        <View style={[styles.container, style]}>{children}</View>
    );
};

function Field({...rest}: TextInputProps){
    return(
        <TextInput style={styles.input} placeholderTextColor={theme.colors.gray_300} {...rest}/>
    );
}

//Adicionando o parâmetro Field dentro de Input
Input.Field = Field;

//Exportando o componente Input
export {Input};