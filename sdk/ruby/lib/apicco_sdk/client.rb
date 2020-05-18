module ApiccoSDK
  class Client
    include ::ApiccoSDK::Helpers

    def initialize(origin, rel_path:'api/v1', api:{}, intercept: ->(req) { req })
      @rel_path = rel_path
      @origin = origin
      @intercept = intercept
      @api = discover_api(api)
    end

    def method_missing(m, *args, &block)
      method_name = m.to_s
      super unless @api.key?(method_name)

      data = (args[0] || {}).transform_keys!(&:to_s) 

      action, params = @api[method_name]

      required_params = params.inject([]) do |memo, p|
        memo << p[1..-1] if p[0] == "*"
        memo
      end

      missing_params = required_params.select { |p| data[p].nil? }

      fail "#{m} missing params: #{missing_params.join(", ")}" if missing_params.any?
      request(:post, "#{@url}/#{action}", data.to_json)
    end

    def respond_to_missing?(method_name, include_private = false)
      @api.key?(method_name) || super
    end

    private

    def url
      @url ||= "#{@origin}/#{@rel_path}"
    end

    def discover_api(api)
      api = request(:get, "#{url}/discovery") if api.nil? || api.empty?
      parse_api_hash(api)
    end

    def parse_api_hash(h)
      h
        .inject({}) do |memo, item|
          k, v = item
          new_key = underscore(k.gsub(".", "_"))
          memo[new_key] = [k, v]
          memo
        end
    end

    def request(method, url, payload = nil, headers = {})
      response = _execute(method, url, payload, headers)
      parse_response(response) unless response.code == 204
    rescue ::RestClient::ExceptionWithResponse => e
      raise e if e.http_code > 501
      parse_response(e.response)
    end

    def parse_response(res)
      JSON.parse(res)
    end

    def _execute(method, url, payload, headers)
      req = {
        method: method, 
        url: url, 
        payload: payload,
        content_type: :json,
        headers: {
          Accept: "application/json",
          "User-Agent" => "Apicco Ruby SDK #{VERSION}"
        }.merge(headers)
      }
      @intercept.call(req)
      ::RestClient::Request.execute(req)
    end
  end
end
