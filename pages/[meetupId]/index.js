import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';

export default function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
        id={props.meetupData.id}
      />
    </>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.MY_ENVIRONMENT_VARIABLE);
  const db = client.db('meetups-db');
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); //get only the _id of each document and put them into an array.

  client.close();

  return {
    fallback: false, //if false, the paths object contains all possible params and ids; if true, it can generate missing ones on the fly.
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })), //generate our array of paths dynamically.
  };
}

export async function getStaticProps(context) {
  // getting the param from the context object:
  const { meetupId } = context.params; //

  //fetch data for a single meetup:
  const client = await MongoClient.connect(process.env.MY_ENVIRONMENT_VARIABLE);
  const db = client.db('meetups-db');
  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  }); // don't forget to import { ObjectId } from 'mongodb'!

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(), //converting ObjectId to a string.
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
      },
    },
  };
}
