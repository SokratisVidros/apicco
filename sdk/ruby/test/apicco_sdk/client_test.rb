require "test_helper"

class ClientTest < Minitest::Test
  def setup
    @origin = 'http://example.com'
  end

  def test_origin_is_a_required_argument
    assert_raises(ArgumentError) { ApiccoSDK::Client.new }
  end

  def test_rel_path_makes_request_to_different_path_from_default
    stub_discovery_request(url: "#{@origin}/api/discovery")
    api = ApiccoSDK::Client.new(@origin, rel_path:'api')
  end

  def test_api_does_not_make_request_to_discovery_endpoint
    api = ApiccoSDK::Client.new(@origin, api: JSON.parse(discovery_response))
  end

  def test_intercept_can_modify_the_request_options
    stub_discovery_request_with_options(options: {headers: {Authorization: "Bearer deadbeef"}})

    intercept= ->(req) { req[:headers][:Authorization] = "Bearer deadbeef" }
    api = ApiccoSDK::Client.new(@origin, intercept: intercept)
  end

  def test_retrieves_api_from_discovery_endpoint
    stub_discovery_request

    api = ApiccoSDK::Client.new(@origin)
  end

  def test_validates_required_parameters_upon_method_execution
    stub_discovery_request

    api = ApiccoSDK::Client.new(@origin)
    error = assert_raises(RuntimeError) { api.resource_required_action }
    assert_equal "resource_required_action missing params: required_arg1, required_arg2", error.message
  end

  def test_executes_request_for_the_resource_and_action_invoked
    payload = { required_arg1: '1', required_arg2: '2', arg3: '3' }
    response_payload = { "key" => 'value' }
    action_url = 'http://example.com/api/v1/resource.requiredAction'

    stub_discovery_request
    stub_request(:post, action_url).
      with(
        body: payload.to_json,
        headers: {
          'Accept'=>'application/json',
          'User-Agent'=>"Apicco Ruby SDK #{ApiccoSDK::VERSION}"
        }).
      to_return(status: 200, body: response_payload.to_json)
    api = ApiccoSDK::Client.new(@origin)

    response = api.resource_required_action(payload)

    assert_equal(response_payload, response)
  end

  def test_executes_request_with_intercept
    response_payload = { "key" => 'value' }
    action_url = 'http://example.com/api/v1/resource.action'

    stub_discovery_request
    stub_request(:post, action_url).
      with(
        headers: {
          'Accept'=>'application/json',
          'User-Agent'=>"Apicco Ruby SDK #{ApiccoSDK::VERSION}",
          'Authorization'=>'Bearer deadbeef'
        }).
      to_return(status: 200, body: response_payload.to_json)
    intercept= ->(req) { req[:headers][:Authorization] = "Bearer deadbeef" }
    api = ApiccoSDK::Client.new(@origin, intercept: intercept)

    response = api.resource_action

    assert_equal(response_payload, response)
  end
end
