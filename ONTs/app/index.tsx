import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';

import * as Clipboard from 'expo-clipboard';
import onts from './data/onts.json';

/* 🔹 MAPA DE IMAGENS OFFLINE */
const imagens: Record<string, any> = {
  'zte_h3601p.jpg': require('../assets/images/zte_h3601p.jpg'),
  'GPON_Home_Gateway.jpg': require('../assets/images/GPON_Home_Gateway.jpg'),
  'HUAWEI_HS8545M5.jpg': require('../assets/images/HUAWEI_HS8545M5.jpg'),
  'NOKIA_NOVA_INTERFACE.jpeg': require('../assets/images/NOKIA_NOVA_INTERFACE.jpeg'),
  'MITRASTAR_2541.jpeg': require('../assets/images/MITRASTAR_2541.jpeg'),
  'MITRASTAR_ASKY.jpeg': require('../assets/images/MITRASTAR_ASKY.jpeg'),
  'FIBER_HOME.jpeg': require('../assets/images/FIBER_HOME.jpeg'),
  'ZTE.jpeg': require('../assets/images/ZTE.jpeg'),
};

export default function Home() {
  const [ipInput] = useState('');
  const [showPesquisa] = useState(false);
  const [menuAtivo, setMenuAtivo] = useState<'home' | 'onts' | 'config'>('home');

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
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ONTs</Text>
          <Text style={styles.headerSubtitle}>
            Acesso rápido às interfaces de ONTs
          </Text>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => Linking.openURL('https://base-nine-liard.vercel.app/#')}
          >
            <Text style={styles.mainButtonText}>ACESSOS DAS ONTs</Text>
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO */}
        {menuAtivo === 'home' && (
          <FlatList
            data={onts}
            keyExtractor={(item) => item.modelo}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {/* IMAGEM */}
                {item.imagem && imagens[item.imagem] && (
                  <Image source={imagens[item.imagem]} style={styles.ontImage} />
                )}

                {/* MODELO */}
                <Text style={styles.title}>{item.modelo}</Text>

                {/* BOTÃO IP */}
                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={() => Linking.openURL(`http://${item.ip}`)}
                >
                  <Text style={styles.btnText}>Abrir {item.ip}</Text>
                </TouchableOpacity>

                {/* INTERFACES */}
                {item.interfaces.map((iface, index) => (
                  <View key={index} style={styles.interfaceBox}>
                    <Text style={styles.interfaceText}>
                      LOGIN: {iface.login}{' '}
                      <Text
                        style={styles.copyBtn}
                        onPress={() => copiarTexto(iface.login)}
                      >
                        📋
                      </Text>
                    </Text>

                    <Text style={styles.interfaceText}>
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
        )}

        {menuAtivo === 'config' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              ⚙️ Configurações (em breve)
            </Text>
          </View>
        )}

        {/* MENU INFERIOR */}
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => setMenuAtivo('home')}>
            <Text style={[styles.menuItem, menuAtivo === 'home' && styles.menuAtivo]}>
              🏠 Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMenuAtivo('onts')}>
            <Text style={[styles.menuItem, menuAtivo === 'onts' && styles.menuAtivo]}>
              📡 ONTs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMenuAtivo('config')}>
            <Text style={[styles.menuItem, menuAtivo === 'config' && styles.menuAtivo]}>
              ⚙️ Menu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  header: {
    padding: 20,
    backgroundColor: '#0f172a',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },

  headerSubtitle: {
    color: '#cbd5e1',
    marginTop: 4,
    marginBottom: 14,
  },

  mainButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    elevation: 3,
  },

  ontImage: {
    width: '100%',
    height: 170,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0f172a',
  },

  openBtn: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  interfaceBox: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },

  interfaceText: {
    color: '#0f172a',
  },

  copyBtn: {
    color: '#16a34a',
    fontWeight: 'bold',
  },

  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0f172a',
    paddingVertical: 12,
  },

  menuItem: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
  },

  menuAtivo: {
    color: '#22c55e',
  },

  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 18,
    color: '#475569',
  },
});
