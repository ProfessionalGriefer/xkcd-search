'use client';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


import { useState, useCallback } from 'react';

import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

function App() {
  const [results, setResults] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value);
  };

  const fetch = useCallback(() => {
    async function fetch() {
      if (!client) return;
      const res = await client.graphql
        .get()
        .withClassName('MultiModal')
        .withNearText({ concepts: [searchTerm] })
        .withFields('filename image _additional{ certainty id }')
        .do();
      setResults(res);
    }

    fetch();
  }, [searchTerm]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    fetch();
    event.preventDefault();
  };

  const getResults = (results: any) => {
    // if (!results) return;
    const head = results['data']['Get']['MultiModal'][0];
    if (head)
      return <div className="flex items-center justify-center flex-col">
        <Image
          height={200}
          width={800}
          alt="Certainty: "
          src={
            'data:image/jpg;base64,' +
            head['image']
          }
        />
        <div >Certainty: {(head['_additional']['certainty'] * 100).toFixed(2)} %</div>
      </div>
  }

  const getRestResults = (results: any) => {
    // if (!results) return;
    const [, ...rest] = results['data']['Get']['MultiModal'];
    // if (rest)
    return <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingTop: "20px" }}>
      {
        rest.map((obj: any) => {
          return (
            <div key={obj['_additional']['id']}>
              <Image
                height={5000}
                width={400}
                alt="Certainty: "
                src={
                  'data:image/jpg;base64,' +
                  obj['image']
                }
              />
              <div >Certainty: {(obj['_additional']['certainty'] * 100).toFixed(2)} %</div>
            </div>
          )
        })
      }
    </div>
  }

  // if (results?.data)
  return (
    <div className="container pt-8" >
      <h1 className="text-3xl font-bold">
        XKCD Comic Search
      </h1>
      <form
        onSubmit={onSubmit}
      >
        <div className="flex flex-row my-4">
          <Input
            className="mr-4"
            type="text"
            placeholder="Search for images"
            onChange={onChange}
          />
          <Button
            className="font-bold"
            type="submit"
            value="Search"
            style={{ backgroundColor: '#fa0171' }}
          >Search</Button>
        </div>
      </form>
      {results.data && getResults(results)}
      {results.data &&
        <div className="control" style={{ paddingTop: "20px" }}>
        </div>}
      {results.data && getRestResults(results)}
      <div style={{ height: '50px' }} />
    </div>
  );
}
export default App;
