module ApiccoSDK
  module Helpers
    ACRONYM_REGEX             = /(?=a)b/
    ACRONYMS_UNDERSCORE_REGEX = /(?:(?<=([A-Za-z\d]))|\b)(#{ACRONYM_REGEX})(?=\b|[^a-z])/
    # see: https://github.com/rails/rails/blob/76ae3dbed301d7178c221b0c957c6b73464eec58/activesupport/lib/active_support/inflector/methods.rb#L92
    def underscore(camel_cased_word)
      return camel_cased_word unless /[A-Z-]|::/.match?(camel_cased_word)
      word = camel_cased_word.to_s.gsub("::", "/")
      word.gsub!(ACRONYMS_UNDERSCORE_REGEX) { "#{$1 && '_' }#{$2.downcase}" }
      word.gsub!(/([A-Z\d]+)([A-Z][a-z])/, '\1_\2')
      word.gsub!(/([a-z\d])([A-Z])/, '\1_\2')
      word.tr!("-", "_")
      word.downcase!
      word
    end
  end
end