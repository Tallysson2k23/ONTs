import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
  Image,
} from 'react-native';

import * as Clipboard from 'expo-clipboard';
import onts from './data/onts.json';

/* 🔹 MAPA DE IMAGENS OFFLINE
   O nome AQUI precisa bater com o campo "imagem" do JSON */
const imagens: Record<string, any> = {
  'zte_h3601p.jpg': require('./assets/images/zte_h3601p.jpg'),
  'huawei_hs8545m5.jpg': require('./assets/images/huawei_hs8545m5.jpg'),
  'nokia.jpg': require('./assets/images/nokia.jpg'),
  'mitrastar_2541.jpg': require('./assets/images/mitrastar_2541.jpg'),
  'mitrastar_asky.jpg': require('./assets/images/mitrastar_asky.jpg'),
  'fiberhome.jpg': require('./assets/images/fiberhome.jpg'),
  'zte_admin.jpg': require('./assets/images/zte_admin.jpg'),
  'movistar.jpg': require('./assets/images/movistar.jpg'),
  'mitrastar_8115.jpg': require('./assets/images/mitrastar_8115.jpg'),
  'tim.jpg': require('./assets/images/tim.jpg'),
  'shoreline.jpg': require('./assets/images/shoreline.jpg'),
  'askey.jpg': require('./assets/images/askey.jpg'),
  'huawei_hg8245q2.jpg': require('./assets/images/huawei_hg8245q2.jpg'),
};

export default function Home() {
  const [ipInput, setIpInput] = useState('');
  const [showPesquisa, setShowPesquisa] = useState(false);

  function gerarLinks() {
    if (!ipInput.trim()) {
      Alert.alert('Informe um IP válido');
      return;
    }

    const variacoes = [
      ipInput,
      `${ipInput}:8080`,
      `${ipInput}/login.html`,
      `${ipInput}/config`,
      `http://${ipInput}`,
      `https://${ipInput}`,
    ];

    variacoes.forEach(v => {
      const url = v.startsWith('http') ? v : `http://${v}`;
      Linking.openURL(url);
    });
  }

  function copiarTexto(texto: string) {
    Clipboard.setStringAsync(texto);
    Alert.alert('Copiado', texto);
  }

  return (
    <View style={styles.container}>
      {/* BOTÃO PESQUISA */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.green}
          onPress={() => setShowPesquisa(!showPesquisa)}
        >
          <Text style={styles.btnText}>🔍 Pesquisa de IP</Text>
        </TouchableOpacity>
      </View>

      {/* PESQUISA IP */}
      {showPesquisa && (
        <View style={styles.pesquisaBox}>
          <TextInput
            placeholder="ex: 192.168.1.1"
            style={styles.input}
            value={ipInput}
            onChangeText={setIpInput}
          />

          <TouchableOpacity style={styles.blue} onPress={gerarLinks}>
            <Text style={styles.btnText}>Gerar links</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* LISTA DE ONTs */}
      <FlatList
        data={onts}
        keyExtractor={(item) => item.modelo}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* IMAGEM */}
            {item.imagem && imagens[item.imagem] && (
              <Image
                source={imagens[item.imagem]}
                style={styles.ontImage}
              />
            )}

            {/* MODELO */}
            <Text style={styles.title}>{item.modelo}</Text>

            {/* IP */}
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => Linking.openURL(`http://${item.ip}`)}
            >
              <Text style={styles.btnText}>Abrir {item.ip}</Text>
            </TouchableOpacity>

            {/* INTERFACES */}
            {item.interfaces.map((iface, index) => (
              <View key={index} style={styles.interfaceBox}>
                <Text>
                  LOGIN: {iface.login}{' '}
                  <Text
                    style={styles.copyBtn}
                    onPress={() => copiarTexto(iface.login)}
                  >
                    📋
                  </Text>
                </Text>

                <Text>
                  SENHA: {iface.senha}{' '}
                  <Text
                    style={styles.copyBtn}
                    onPress={() => copiarTexto(iface.senha)}
                  >
                    📋
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  green: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
  },
  blue: {
    backgroundColor: '#1565c0',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pesquisaBox: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
  },
  ontImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  interfaceBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#eaeaea',
    borderRadius: 6,
  },
  copyBtn: {
    color: 'green',
    fontWeight: 'bold',
  },
  openBtn: {
    backgroundColor: '#1565c0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});
