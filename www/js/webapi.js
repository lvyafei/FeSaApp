获取token:

http://lvyafei1.jsp.jspee.com.cn/portal/oauth/token?grant_type=password&client_id=restapp&client_secret=restapp&username=fsmobile&password=fsmobile@20160704


{"access_token":"b517bdad-5f90-4289-ae16-d2fb5d648afb","token_type":"bearer","refresh_token":"0f54c84e-5c3e-41c0-ad6f-0dfb13dcb92d","expires_in":499}



访问:

http://lvyafei1.jsp.jspee.com.cn/portal/api/users/login?access_token=fe11c4e9-f57c-4d61-a4cd-ec4f5763acfc&username=lyf&password=1


刷新:

http://lvyafei1.jsp.jspee.com.cn/portal/oauth/token?grant_type=refresh_token&client_id=restapp&client_secret=restapp&refresh_token=7ac7940a-d29d-4a4c-9a47-25a2167c8c49
