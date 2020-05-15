import React from 'react';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const MyDoc = () => (
  <Document>
    <Page>
      <View>
        <Text>Hallo das ist ein Twst</Text>
      </View>
    </Page>
  </Document>
);

export default function NewJob({ data }) {
  const { clientId, jobCode, jobTitle } = data;

  const renderPDF = () => (
    <Document>
      <Page size='A4'>
        <View>
          <Text>HEADING: IMPRESS DESIGN/PEARSHOP NEW JOB BRIEF</Text>
        </View>
        <View>
          <Text>{clientId}</Text>
          <Text>{jobCode}</Text>
          <Text>{jobTitle}</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      {renderPDF()}
      <div>
        <PDFDownloadLink document={renderPDF()} fileName='somename.pdf'>
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download now!'
          }
        </PDFDownloadLink>
      </div>
    </>
  );
}
