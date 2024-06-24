import { ref } from 'vue';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from 'src/firebase';

const users = ref<DocumentData>([]);

async function getUsers() {
  console.log('Fetching users...');
  const querySnapshot = await getDocs(collection(db, 'users'));
  const usersArray: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    const user = {
      id: doc.id,
      username: doc.data().username,
      email: doc.data().email,
      password: doc.data().password,
    };
    usersArray.push(user);
  });
  users.value = usersArray;
  console.log('Users fetched!');
  console.log(users);
  return users;
}

export function useUsers() {
  return { users, getUsers };
}
