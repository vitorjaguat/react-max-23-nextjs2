import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';

// const DUMMY_MEETUPS = [
//   {
//     id: 'm1',
//     title: 'A First Meetup',
//     image: 'https://www.marica.rj.gov.br/wp-content/uploads/2022/01/marica.png',
//     address: 'Praça dos Clubes, s/n',
//     description: 'This is a first meetup.',
//   },
//   {
//     id: 'm2',
//     title: 'Second Meetup',
//     image: 'https://10619-2.s.cdn12.com/rests/original/108_505717869.jpg',
//     address:
//       'Rua 104 lote 4 quadra 477 - Jardim Atlântico Leste, Maricá - RJ, 24933-345',
//     description: 'This is a second meetup.',
//   },
// ];

export default function HomePage(props) {
  return (
    <>
      <Head>
        <title>Meetups</title>
        <meta
          name="description"
          content="Your website to create meetups all around the world"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

export async function getStaticProps() {
  //this code will only run on the build process
  //this code will never appear on the client-side

  //fetch data from API:
  //fetch('/api/meetups') //we could do it like this, but we don't need to.
  const client = await MongoClient.connect(process.env.MY_ENVIRONMENT_VARIABLE);
  const db = client.db('meetups-db');
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray(); //get all documents in 'meetups' collection and transform them into an array;

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(), //convert the ObjectId() to a string;
      })),
    },
    revalidate: 10, //this SSG-page will be re-generated every 10s on the server (if the page receives requests)
  };
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   //fetch data from an API, etc.

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }
