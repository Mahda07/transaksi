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
 
 // menambah barang ke keranjang
 export async function tambahBarangKeKeranjang(
   idbarang,
   nama,
   harga,
   jumlah,
   idpelanggan,
   namapelanggan
 ) {
   try {
     // periksa apakah idbarang sudah ada di collection transaksi?
     
     // mengambil data di seluruh collection transaksi
     let refDokumen = collection(basisdata, "transaksi")
     
     // membuat query untuk mencari data berdasarkan idbarang
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
       // kalau sudah ada, tambahkan jumlahnya saja
       jumlahSebelumnya++
       await updateDoc(doc(basisdata, "transaksi", idtransaksi), { jumlah: jumlahSebelumnya })
     }
     
     // menampilkan pesan berhasil
     console.log("berhasil menyimpan keranjang")
   } catch (error) {
     // menampilkan pesan gagal
     console.log(error)
   }
 }
 
 // menampilkan barang di keranjang
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
 
 export async function hapusBarangDariKeranjang(id) {
   await deleteDoc(doc(basisdata, "transaksi", id))
 }
 
 // fungsi ambil daftar pelanggan
 export async function ambilDaftarPelanggan() {
   const refDokumen = collection(basisdata, "pelanggan");
   const kueri = query(refDokumen, orderBy("nama"));
   const cuplikanKueri = await getDocs(kueri);
   
   let hasilKueri = [];
   cuplikanKueri.forEach((dokumen) => {
     hasilKueri.push({
       id: dokumen.id,
       nama: dokumen.data().nama,
       alamat: dokumen.data().alamat,
       nohape: dokumen.data().nohape
     })
   })
   
   return hasilKueri;
 }
 
 export async function ambilBarangProsesDiKeranjang() {
   let refDokumen = collection(basisdata, "transaksi")
   
   // membuat query untuk mencari data yg masih proses
   let queryBarangProses = query(refDokumen, where("idpelanggan", "==", "proses"))
   
   let snapshotBarang = await getDocs(queryBarangProses)
   let hasilKueri = []
   snapshotBarang.forEach((dokumen) => {
     hasilKueri.push({
       id: dokumen.id,
       nama: dokumen.data().nama,
       jumlah: dokumen.data().jumlah,
       harga: dokumen.data().harga,
       idpelanggan: dokumen.data().idpelanggan,
       namapelanggan: dokumen.data().namapelanggan,
     })
   })
   return hasilKueri
 }
 
 export async function ubahBarangProsesDiKeranjang(idpelanggan, namapelanggan){
   let refDokumen = collection(basisdata, "transaksi")

// membuat query untuk mencari data yg masih proses
let queryBarangProses = query(refDokumen, where("idpelanggan", "==", "proses"))

let snapshotBarang = await getDocs(queryBarangProses)
 snapshotBarang.forEach((dokumen)=>{
   await updateDoc(
     doc(basisdata, "transaksi", dokumen.id),
     { idpelanggan: idpelanggan, namapelanggan: namapelanggan  }
     
   )
 })
 }
 
 export async function ambilpelanggan(id) {
   const refDokumen = await doc(basisdata, "pelanggan", id)
   const snapshotDokumen = await getDoc(refDokumen)
   
   return await snapshotDokumen.data()
 }
 