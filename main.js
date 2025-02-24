import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'


const firebaseConfig = {
  apiKey: "AIzaSyCfqZD7UZZt-GWmtNhfJyksrv3-8ENRjto",
  authDomain: "insan-cemerlang-d5574.firebaseapp.com",
  projectId: "insan-cemerlang-d5574",
  storageBucket: "insan-cemerlang-d5574.appspot.com",
  messagingSenderId: "1035937160050",
  appId: "1:1035937160050:web:6d77d3874c3f78b2811beb",
  measurementId: "G-EVVQ80Q08C"
};

//inisialisasi firebase
const aplikasi = initializeApp(firebaseConfig)
const basisdata = getFirestore(aplikasi)

//fungsi ambil daftar barang 
export async function ambilDaftarBarang() {
  const refDokumen = collection(basisdata, "inventory");
  const kueri = query(refDokumen, orderBy("item"));
  const cuplikanKueri = await getDocs(kueri);

  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      item: dokumen.data().item,
      jumlah: dokumen.data().jumlah,
      harga: dokumen.data().harga
    })
  })

  return hasilKueri;
}

//Menambah barang ke keranjang 
export async function tambahBarangKeKeranjang(
  idbarang,
  nama,
  harga,
  jumlah,
  idpelanggan,
  namapelanggan
) {
  try {
    // periksa apakah idbarng sudah ada dicollectoin transaksi?
    console.log(idbarang)
    console.log(nama)
    console.log(harga)
    console.log(jumlah)
    console.log(idpelanggan)
    console.log(namapelanggan)

    // mengambil data di seluruh coolection transaksi
    let refDokumen = collection(basisdata, "transaksi")

    // membuat query unruk mencari data bedasarkan idbarang
    let queryBarang = query(refDokumen, where("idbarang", "==", idbarang))

    let snapshotBarang = await getDocs(queryBarang)
    let jumlahRecord = 0
    let idtransaksi = ''
    let jumlahSebelumnya = 0

    snapshotBarang.forEach((dokumen) => {
      jumlahRecord++
      idtransaksi = dokumen.id
      jumlahSebelumnya = dokumen.data().jumlah 
    })

    if (jumlahRecord == 0) {
      // kalau belum ada, tambahkan langsung ke collection
      const refDokumen = await addDoc(collection(basisdata, "transaksi"), {
        idbarang: idbarang,
        nama: nama,
        harga: harga,
        jumlah: jumlah,
        idpelanggan: idpelanggan,
        namapelanggan: namapelanggan
      })
    } else if (jumlahRecord == 1) {
     // kalo sudah ada, tambahkan jumlahnya saja
     jumlahSebelumnya++
     await updateDoc(doc(basisdata, "transaksi", idtransaksi), { jumlah: jumlahSebelumnya })
    }

    // Menampilkan pesan berhasil
    console.log("Berhasil menyimpan keranjang")
  } catch (error) {
    // Menampilkan pesan error
    console.log(error)
  }
}
// menambah barang dikeranjang 
export async function ambilDaftarBarangDiKeranjang() {
  const refDokumen = collection(basisdata, "transaksi");
  const kueri = query(refDokumen, orderBy("nama"));
  const cuplikanKueri = await getDocs(kueri);

  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      nama: dokumen.data().nama,
      jumlah: dokumen.data().jumlah,
      harga: dokumen.data().harga
    })
  })

  return hasilKueri;
}

export async function  hapusBarangDariKeranjang(id){
  await deleteDoc(doc(basisdata, "transaksi",id))
}