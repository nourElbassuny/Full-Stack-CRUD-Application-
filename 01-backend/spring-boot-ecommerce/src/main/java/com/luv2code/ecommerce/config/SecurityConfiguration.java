package com.luv2code.ecommerce.config;


//@Configuration
public class SecurityConfiguration {

//    @Bean
//    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//
//        //protect endpoint /api/orders
//        http.authorizeHttpRequests(requests ->
//                        requests
//                                .requestMatchers("/api/orders/**")
//                                .authenticated()
//                                .anyRequest().permitAll())
//                .oauth2ResourceServer(oauth2ResourceServer -> oauth2ResourceServer.jwt(Customizer.withDefaults()));
//
//        // + CORS filters
//        http.cors(Customizer.withDefaults());
//
//        // + content negotiation strategy
//        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());
//
//        // + non-empty response body for 401 (more friendly)
//        Okta.configureResourceServer401ResponseBody(http);
//
//        // we are not using Cookies for session tracking >> disable CSRF
//        http.csrf(AbstractHttpConfigurer::disable);
//
//
//        return http.build();
//    }
}