$LOAD_PATH.unshift File.expand_path("../../lib", __FILE__)

require "apicco_sdk"
require "minitest/autorun"
require 'webmock/minitest'
require "mocha/minitest"
require "byebug"

WebMock.disable_net_connect!

module Minitest
  class Test
    def stub_discovery_request(url: "http://example.com/api/v1/discovery")
      stub_request(:get, url).
        with(headers: {
          'Accept'=>'application/json',
          'User-Agent'=>"Apicco Ruby SDK #{ApiccoSDK::VERSION}",
        }).
        to_return(status: 200, body: discovery_response)
    end

    def stub_discovery_request_with_options(url: "http://example.com/api/v1/discovery", options:{})
      stub_request(:get, url).
        with(options).
        to_return(status: 200, body: discovery_response)
    end

    def stub_api_request(url: "http://example.com/api/v1/", body:{})
      stub_request(:post, url).
        with(body:body).
        to_return(status: 200)
    end

    def discovery_response
      {
        "resource.action": ["arg1", "arg2"], 
        "resource.requiredAction": ["*required_arg1", "*required_arg2", "arg3"] 
      }.to_json
    end
  end
end
