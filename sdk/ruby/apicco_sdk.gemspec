lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "apicco_sdk/version"

Gem::Specification.new do |spec|
  spec.name          = "apicco-sdk"
  spec.version       = ApiccoSDK::VERSION
  spec.authors       = ["Dimitris Klouvas"]
  spec.email         = ["dimitris.klouvas@gmail.com"]

  spec.summary       = "Apicco Ruby SDK"
  spec.description   = "Apicco Ruby SDK to export client using discovery service"
  spec.homepage      = "https://github.com/sokratisvidros/apicco#readme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").reject do |f|
    f.match(%r{^(test|spec|features)/})
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "json", "~> 2.2.0"
  spec.add_dependency "rest-client", "~> 2.0.2"

  spec.add_development_dependency "bundler", "~> 2.0.2"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "gem-release", "~> 2.0"
  spec.add_development_dependency "minitest", "~> 5.0"
  spec.add_development_dependency "webmock", "~> 3.3"
  spec.add_development_dependency "byebug", "~> 10.0"
  spec.add_development_dependency "mocha", "~> 1.7"
end
