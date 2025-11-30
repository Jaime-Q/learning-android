import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import MainMenu from "./MainMenu";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile_number: string;
  avatar_url: string;
}

interface MainProps {
  onLogout: () => void;
  user: User;
}

export default function Main({ onLogout, user }: MainProps) {
  const [screen, setScreen] = useState<string>("Home");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleNavigate = (selectedScreen: string) => {
    if (selectedScreen === "Logout") {
      onLogout(); // Llama a la función de logout pasada por props
      return;
    }

    setScreen(selectedScreen);
    if (selectedScreen === "Products") {
      fetchProducts();
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Menú hamburguesa */}
      <MainMenu onNavigate={handleNavigate} />

      {/* Vista de Perfil */}
      {screen === "Profile" ? (
        <View style={styles.profileContainer}>
          <Image
            source={
              user.avatar_url ? { uri: user.avatar_url } : require("../assets/images/proteccion.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {user.firstname} {user.lastname}
          </Text>
          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileInfoLabel}>Email:</Text>
            <Text style={styles.profileInfoValue}>{user.email}</Text>
          </View>
          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileInfoLabel}>Mobile:</Text>
            <Text style={styles.profileInfoValue}>{user.mobile_number}</Text>
          </View>
        </View>
      ) : screen === "Products" ? (
        // Vista de Productos
        loading ? (
          <ActivityIndicator
            size="large"
            color="#007BFF"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProduct}
            contentContainerStyle={styles.list}
            style={{ flex: 1 }} // Esto permite el scroll
          />
        )
      ) : (
        // Vista de Home (por defecto)
        <View style={styles.home}>
          <Text style={styles.homeText}>
            ¡Welcome, {user.firstname}!
          </Text>
        </View>
      )}

      {/* Modal de producto */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedProduct.description}
                </Text>
                <Text style={styles.modalPrice}>
                  ${selectedProduct.price.toFixed(2)}
                </Text>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => alert("Producto agregado al carrito 🛒")}
                >
                  <Text style={styles.addButtonText}>🛒 Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Un azul oscuro más moderno
  },
  home: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeText: {
    color: "#e2e8f0", // Un blanco más suave
    fontSize: 24,
    fontWeight: "bold",
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#38bdf8", // Un azul cielo más vibrante
  },
  profileName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#e2e8f0",
    marginBottom: 20,
  },
  profileInfoContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  profileInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#94a3b8", // Un gris azulado para etiquetas
    width: 80,
  },
  profileInfoValue: {
    fontSize: 16,
    color: "#e2e8f0",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#1a1a1a",
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 12,
  },
  title: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  price: {
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1f2937", // Consistente con el fondo de las tarjetas
    padding: 20,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
  },
  modalImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 12,
  },
  modalTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  modalPrice: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: "#ef4444", // Un rojo más suave
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
});