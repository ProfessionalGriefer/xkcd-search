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


  // if (results?.data)
  return (
    <>
      {!results.data && <div className="absolute w-screen h-screen -z-10">
        <Image
          src="/background_image.webp"
          alt="background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>}
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
        <Results results={results} />
        <RestResults results={results} />
        <div style={{ height: '50px' }} />
      </div>
    </>
  );
}
const Results = ({ results }: { results: any }) => {
  if (!results?.data) return <></>;
  const head = results['data']['Get']['MultiModal'][0];
  if (head)
    return <div className="flex items-center justify-center flex-col h-96 relative my-4">
      <Image
        fill
        objectFit="contain"
        src={
          'data:image/webp;base64,' +
          head['image']
        }
        alt="Best image"
      />
      <div >Certainty: {(head['_additional']['certainty'] * 100).toFixed(2)} %</div>
    </div>
}

const RestResults = ({ results }: { results: any }) => {
  if (!results?.data) return <></>;
  const [, ...rest] = results['data']['Get']['MultiModal'];
  // if (rest)
  return <div className="flex flex-wrap justify-between gap-y-4 gap-x-2">
    {
      rest.map((obj: any) => {
        return (
          <div key={obj['_additional']['id']} >
            <img
              style={{ maxHeight: '200px' }}
              alt="Image"
              loading="lazy"
              src={
                'data:image/webp;base64,' +
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

export default App;

