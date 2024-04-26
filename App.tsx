import { Home } from '@/app/home';
import { Loading } from '@/components/loading';
import { useFonts, Ubuntu_700Bold, Ubuntu_500Medium, Ubuntu_400Regular} from '@expo-google-fonts/ubuntu'; //Importando as fontes
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function App() {

  const [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Ubuntu_500Medium,
    Ubuntu_400Regular,
  });

  //Se a fonte ainda não foi carregada - adiciona um load
  if(! fontsLoaded){
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
      <Home />
    </GestureHandlerRootView>
  );
}