package com.xx.router;

import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;

/**
 * Created by uv2sun on 15/12/19.
 */
@Controller
public class Test {

    @RequestMapping(value = "/hello")
    public String hello(HttpServletRequest req, HttpServletResponse resp) {
        System.out.println("/hello");
        /**
         * 转发到 url:/
         */
//        return "forward:/";
        /**
         * 重定向到 url:/
         */
        return "redirect:/";
    }

    @RequestMapping("/json")
    @ResponseBody //增加此注解,表明返回的响应体,非视图名称
    public Object json() {
        System.out.println("/json");
        return JSONObject.fromObject("{a:1}");
    }

    @RequestMapping("/")
    @ResponseBody
    public String testIndex() {
        return "index"; //返回index字符串
    }

    @RequestMapping("/index")
    public String index() {
        return "index"; //返回视图名称index
    }

    /**
     * 接受angular的post来的数据,头为Content-type:application/json,需要从request的inputStream中获取
     * spring-mvc已经提供@RequestBody的入参方式获取
     *
     * @param req
     * @param model
     * @param re
     * @return
     * @throws IOException
     */
    @RequestMapping("/user/angular")
    @ResponseBody
    public JSONObject angularPost(HttpServletRequest req, Model model, @RequestBody JSONObject re) throws IOException {
        System.out.println("/user/angular");
        System.out.println("model:" + model);
        System.out.println(req.getContentType());
        System.out.println("@RequestBody:" + re);
        Enumeration<String> es = req.getParameterNames();
        while (es.hasMoreElements()) {
            System.out.println("Request.params:" + es.nextElement());
        }
        return JSONObject.fromObject("{id:1, name:'litx'}");
    }

    /**
     * jquery.post方式,头:application/x-www-form-urlencoded; charset=UTF-8
     * 可以直接request.getParameter()方式获取
     *
     * @param req
     * @param model
     * @return
     */
    @RequestMapping("/user/jquery")
    @ResponseBody
    public JSONObject jqueryPost(HttpServletRequest req, Model model) {
        System.out.println("/user/jquery");
        System.out.println("model:" + model);
        System.out.println(req.getContentType());
        Enumeration<String> es = req.getParameterNames();
        while (es.hasMoreElements()) {
            System.out.println("request.params:" + es.nextElement());
        }
        return JSONObject.fromObject("{id:1, name:'litx'}");
    }

}
