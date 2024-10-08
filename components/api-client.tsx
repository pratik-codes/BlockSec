"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import JSONPretty from "react-json-pretty";



import { DetectionApiData } from "@/config/detection-apis";
import { DetectionApiCall } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



import { Spotlight } from "./spotlight";
import { Card, CardContent } from "./ui/card";


export default function ApiClient() {
  const [method, setMethod] = useState("Post");
  const [scanType, setScanType] = useState("OnChainTransaction");
  const [apiData, setApiData] = useState(DetectionApiData.OnChainTransaction);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (["OnChainTransaction", "OffChainTransaction"].includes(scanType)) {
      const data = DetectionApiData[scanType]
      // sleep for 500 ms
      await new Promise((resolve) => setTimeout(resolve, 900));
      console.log({ data });
      setResponse(JSON.stringify(data.response));
      setIsLoading(false)
      return;
    }

    const apiCallData = DetectionApiData[scanType]
    const res = await DetectionApiCall(apiCallData)
    setResponse(JSON.stringify(res))
    setIsLoading(false)
  }

  const changeScanType = (type: string) => {
    setScanType(type)
    setResponse("")
    const newData = DetectionApiData[type]
    setApiData({ ...newData })
  }

  return (
    <div className="container mt-8 mx-auto p-4 max-w-4xl">
      <Spotlight
        className="-top-50 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <Card className="bg-background shadow-lg rounded-3xl">
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={apiData?.method || method} onValueChange={setMethod}>
                <SelectTrigger className="w-full sm:w-[250px] rounded-xl">
                  <SelectValue className="rounded-xl" placeholder="Method" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem className="rounded-xl" value="Post">Post</SelectItem>
                  <SelectItem className="rounded-xl" value="Get">Get</SelectItem>
                </SelectContent>
              </Select>
              <Input
                readOnly={true}
                type="text"
                placeholder="Enter API URL"
                value={apiData?.showUrl || "https://api.sifu.com/scan"}
                // vaule={apiData.url}
                className="flex-grow rounded-xl"
              />
              <Select value={scanType} onValueChange={changeScanType}>
                <SelectTrigger className="w-full sm:w-[350px] rounded-xl">
                  <SelectValue placeholder="Select scan type rounded-xl" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem className="rounded-xl" value="OnChainTransaction">On-Chain Analysis</SelectItem>
                  <SelectItem className="rounded-xl" value="OffChainTransaction">Off-Chain Transactions</SelectItem>
                  <SelectItem className="rounded-xl" value="Transaction">Scan transactions</SelectItem>
                  <SelectItem className="rounded-xl" value="SmartContract">Scan contract</SelectItem>
                  <SelectItem className="rounded-xl" value="ContractAddress">
                    Scan contract address
                  </SelectItem>
               </SelectContent>
              </Select>
            </div>
            <pre className="rounded-xl bg-muted/50 p-4 rounded-lg overflow-x-auto border border-border text-start">
              <div>
                {/* @ts-ignore */}
                <JSONPretty className="rounded-xl" id="json-pretty" data={apiData.body}></JSONPretty>
              </div>
            </pre>
            <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Request
                </>
              )}
            </Button>
          </form>
          {response && (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-2 text-foreground flex">
                Response
              </h2>
              <pre className="rounded-xl bg-muted/50 p-4 rounded-lg overflow-x-auto border border-border text-start">
                <div>

                  {/* @ts-ignore */}
                  <JSONPretty id="json-pretty" data={response}></JSONPretty>
                </div>
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
